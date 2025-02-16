using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WalletAssessment.Server.Data.Context;
using WalletAssessment.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace WalletAssessment.Server.Controllers
{
    [Route("api/[controller]")]
    public class WalletController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<WalletController> _logger;

        public WalletController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, ILogger<WalletController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("balance")]
        public async Task<IActionResult> GetBalance(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("User not found");

            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == user.Id);
            return Ok(new { Balance = wallet?.Balace ?? 0 });
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit(string email, [FromBody] TransactionRequest request)
        {
            if (request.Amount <= 0)
                return BadRequest("Invalid amount");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound("User not found");

            using var dbTransaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == user.Id);
                if (wallet == null)
                    return NotFound("Wallet not found");

                // Update the wallet balance
                wallet.Balace += request.Amount;

                // Record the deposit transaction
                _context.Transactions.Add(new Transaction
                {
                    Amount = request.Amount,
                    TransactionType = TransactionType.Deposit,
                    Timestamp = DateTime.UtcNow,
                    UserId = user.Id,
                    Description = request.Description
                });

                // Save both changes atomically
                await _context.SaveChangesAsync();
                await dbTransaction.CommitAsync();

                return Ok(new { NewBalance = wallet.Balace });
            }
            catch (Exception ex)
            {
                await dbTransaction.RollbackAsync();
                _logger.LogError(ex, "Deposit failed");
                return StatusCode(500, "Transaction failed");
            }
        }


        [HttpPost("withdraw")]
        public async Task<IActionResult> Withdraw(string email, [FromBody] TransactionRequest request)
        {
            if (request.Amount <= 0) return BadRequest("Invalid amount");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("User not found");

            var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == user.Id);
            if (wallet == null) return NotFound("Wallet not found");

            if (wallet.Balace < request.Amount) return BadRequest("Insufficient funds");

            wallet.Balace -= request.Amount;
            _context.Transactions.Add(new Transaction
            {
                Amount = request.Amount,
                TransactionType = TransactionType.Withdrawal,
                Timestamp = DateTime.UtcNow,
                UserId = user.Id,
                Description = request.Description
            });

            await _context.SaveChangesAsync();
            return Ok(new { NewBalance = wallet.Balace });
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer(string senderEmail, string recipientEmail, [FromBody] TransactionRequest request)
        {
            if (request.Amount <= 0) return BadRequest("Invalid amount");

            var sender = await _userManager.FindByEmailAsync(senderEmail);
            var recipient = await _userManager.FindByEmailAsync(recipientEmail);
            if (sender == null || recipient == null) return NotFound("User not found");

            var senderWallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == sender.Id);
            var recipientWallet = await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == recipient.Id);
            if (senderWallet == null || recipientWallet == null) return NotFound("Wallet not found");

            if (senderWallet.Balace < request.Amount) return BadRequest("Insufficient funds");

            senderWallet.Balace -= request.Amount;
            recipientWallet.Balace += request.Amount;

            _context.Transactions.AddRange(
                new Transaction { Amount = request.Amount, TransactionType = TransactionType.TransferOut, Timestamp = DateTime.UtcNow, UserId = sender.Id, Description = $"Transfer to {recipient.Email}" },
                new Transaction { Amount = request.Amount, TransactionType = TransactionType.TransferIn, Timestamp = DateTime.UtcNow, UserId = recipient.Id, Description = $"Transfer from {sender.Email}" }
            );

            await _context.SaveChangesAsync();
            return Ok(new { NewBalance = senderWallet.Balace });
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions(string email, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("User not found");

            var query = _context.Transactions.Where(t => t.UserId == user.Id).OrderByDescending(t => t.Timestamp);
            var totalCount = await query.CountAsync();
            var transactions = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(new { TotalCount = totalCount, Page = page, PageSize = pageSize, Transactions = transactions });
        }
    }



// DTO Classes
public class TransactionRequest
    {
        [Range(0.01, double.MaxValue)]
        public double Amount { get; set; }
        public string Description { get; set; }
    }

    public class TransferRequest : TransactionRequest
    {
        [Required]
        [EmailAddress]
        public string RecipientEmail { get; set; }
    }

    public class TransactionDto
    {
        public double Amount { get; set; }
        public string Type { get; set; }
        public DateTime Timestamp { get; set; }
        public string Description { get; set; }
    }

    // TransactionType Enum
    public enum TransactionType
    {
        Deposit,
        Withdrawal,
        TransferIn,
        TransferOut
    }
}
