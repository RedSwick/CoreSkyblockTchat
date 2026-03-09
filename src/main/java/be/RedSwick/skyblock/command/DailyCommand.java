package be.RedSwick.skyblock.command;

import be.RedSwick.skyblock.SkyBlockPlugin;
import be.RedSwick.skyblock.config.Messages;
import be.RedSwick.skyblock.config.PluginConfig;
import be.RedSwick.skyblock.gui.DailyGUI;
import be.RedSwick.skyblock.manager.DailyRewardManager;
import be.RedSwick.skyblock.player.PlayerData;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

import java.util.Map;

public class DailyCommand implements CommandExecutor {

    private final DailyRewardManager manager = new DailyRewardManager();

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player player)) return true;
        if (!PluginConfig.isDailyEnabled()) return true;

        if (args.length > 0 && args[0].equalsIgnoreCase("gui")) {
            player.openInventory(DailyGUI.create(player));
            return true;
        }

        if (!manager.canClaim(player.getUniqueId())) {
            player.sendMessage(Messages.get("daily.already"));
            return true;
        }

        Map<String, Number> reward = manager.claim(player.getUniqueId());
        if (reward.isEmpty()) return true;

        long coins   = reward.getOrDefault("coins", 0).longValue();
        long essence = reward.getOrDefault("essence", 0).longValue();
        int  gems    = reward.getOrDefault("gems", 0).intValue();

        PlayerData data = SkyBlockPlugin.getInstance().getPlayerDataManager().get(player.getUniqueId());
        int streak = data != null ? data.getDailyStreak() : 1;

        player.sendMessage(Messages.get("daily.claimed",
                "day", String.valueOf(streak),
                "coins", String.valueOf(coins),
                "essence", String.valueOf(essence)));
        if (gems > 0) player.sendMessage("§b+§3" + gems + " §bGemmes");
        player.sendMessage(Messages.get("daily.streak", "streak", String.valueOf(streak)));
        return true;
    }
}
