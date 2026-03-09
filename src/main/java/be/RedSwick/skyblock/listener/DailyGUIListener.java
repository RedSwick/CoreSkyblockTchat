package be.RedSwick.skyblock.listener;

import be.RedSwick.skyblock.config.Messages;
import be.RedSwick.skyblock.gui.DailyGUI;
import be.RedSwick.skyblock.manager.DailyRewardManager;
import be.RedSwick.skyblock.player.PlayerData;
import be.RedSwick.skyblock.SkyBlockPlugin;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.inventory.InventoryClickEvent;

import java.util.Map;

public class DailyGUIListener implements Listener {

    @EventHandler
    public void onClick(InventoryClickEvent event) {
        if (!(event.getView().getTitle().equals(DailyGUI.TITLE))) return;
        event.setCancelled(true);
        if (!(event.getWhoClicked() instanceof Player player)) return;
        if (event.getRawSlot() != 13) return;

        DailyRewardManager mgr = new DailyRewardManager();
        if (!mgr.canClaim(player.getUniqueId())) return;

        Map<String, Number> reward = mgr.claim(player.getUniqueId());
        if (reward.isEmpty()) return;

        long coins   = reward.getOrDefault("coins", 0).longValue();
        long essence = reward.getOrDefault("essence", 0).longValue();
        int  gems    = reward.getOrDefault("gems", 0).intValue();

        PlayerData data = SkyBlockPlugin.getInstance().getPlayerDataManager().get(player.getUniqueId());
        int streak = data != null ? data.getDailyStreak() : 1;

        player.sendMessage(Messages.get("daily.claimed", "day", String.valueOf(streak), "coins", String.valueOf(coins), "essence", String.valueOf(essence)));
        if (gems > 0) player.sendMessage("§b+§3" + gems + " §bGemmes");
        player.closeInventory();
    }
}
