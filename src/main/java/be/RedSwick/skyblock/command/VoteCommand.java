package be.RedSwick.skyblock.command;

import be.RedSwick.skyblock.SkyBlockPlugin;
import be.RedSwick.skyblock.config.Messages;
import be.RedSwick.skyblock.config.PluginConfig;
import be.RedSwick.skyblock.player.PlayerData;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class VoteCommand implements CommandExecutor {

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player player)) return true;
        if (!PluginConfig.isVoteEnabled()) return true;

        PlayerData data = SkyBlockPlugin.getInstance().getPlayerDataManager().get(player.getUniqueId());
        if (data == null) return true;

        long now = System.currentTimeMillis();
        long last = data.getLastVote();
        int cooldownHours = PluginConfig.getVoteCooldownHours();
        long cooldownMs = cooldownHours * 3600L * 1000L;

        if (last > 0 && (now - last) < cooldownMs) {
            long rem = (last + cooldownMs - now) / 1000;
            long hours = rem / 3600;
            long minutes = (rem % 3600) / 60;
            player.sendMessage(Messages.get("vote.cooldown", "hours", String.valueOf(hours), "minutes", String.valueOf(minutes)));
            return true;
        }

        data.setLastVote(now);
        long coins = PluginConfig.getVoteRewardCoins();
        long essence = PluginConfig.getVoteRewardEssence();
        data.addCoins(coins);
        data.addEssence(essence);
        SkyBlockPlugin.getInstance().getPlayerDataManager().savePlayerAsync(player.getUniqueId());

        player.sendMessage(Messages.get("vote.claimed", "coins", String.valueOf(coins), "essence", String.valueOf(essence)));
        return true;
    }
}
