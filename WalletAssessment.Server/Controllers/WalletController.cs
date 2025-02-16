using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WalletAssessment.Server.Data.Context;
using WalletAssessment.Server.Models;
using WalletAssessment.Server.Data.Contracts;

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
                new Transaction { Amount = request.Amount, TransactionType = "Transfer", Timestamp = DateTime.UtcNow, UserId = sender.Id, Description = $"Transfer to {recipient.Email}" },
                new Transaction { Amount = request.Amount, TransactionType = "Recieve", Timestamp = DateTime.UtcNow, UserId = recipient.Id, Description = $"Transfer from {sender.Email}" }
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

}
