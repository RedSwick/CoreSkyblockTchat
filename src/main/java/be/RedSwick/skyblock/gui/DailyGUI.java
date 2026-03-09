package be.RedSwick.skyblock.gui;

import be.RedSwick.skyblock.SkyBlockPlugin;
import be.RedSwick.skyblock.config.Messages;
import be.RedSwick.skyblock.config.PluginConfig;
import be.RedSwick.skyblock.manager.DailyRewardManager;
import be.RedSwick.skyblock.player.PlayerData;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.entity.Player;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DailyGUI {

    public static final String TITLE = Messages.get("daily.gui-title");

    public static Inventory create(Player player) {
        Inventory inv = Bukkit.createInventory(null, 27, TITLE);
        for (int i = 0; i < 27; i++)
            inv.setItem(i, makeFiller());

        PlayerData data = SkyBlockPlugin.getInstance().getPlayerDataManager().get(player.getUniqueId());
        DailyRewardManager mgr = new DailyRewardManager();
        boolean canClaim = mgr.canClaim(player.getUniqueId());
        int streak = data != null ? data.getDailyStreak() : 0;

        inv.setItem(4, makeInfoItem(streak, canClaim));
        inv.setItem(13, makeClaimButton(canClaim));
        inv.setItem(22, makeCloseButton());
        return inv;
    }

    private static ItemStack makeFiller() {
        ItemStack i = new ItemStack(Material.GRAY_STAINED_GLASS_PANE);
        ItemMeta m = i.getItemMeta();
        if (m != null) m.setDisplayName("§r");
        i.setItemMeta(m);
        return i;
    }

    private static ItemStack makeInfoItem(int streak, boolean canClaim) {
        ItemStack i = new ItemStack(Material.SUNFLOWER);
        ItemMeta m = i.getItemMeta();
        if (m == null) return i;
        m.setDisplayName("§e§lRécompense quotidienne");
        List<String> lore = new ArrayList<>();
        lore.add("§7Série actuelle : §e" + streak + " §7jours");
        lore.add("");
        lore.add(canClaim ? "§a✔ Tu peux récupérer ta récompense !" : "§c✖ Déjà récupérée aujourd'hui.");
        m.setLore(lore);
        i.setItemMeta(m);
        return i;
    }

    private static ItemStack makeClaimButton(boolean canClaim) {
        ItemStack i = new ItemStack(canClaim ? Material.LIME_WOOL : Material.RED_WOOL);
        ItemMeta m = i.getItemMeta();
        if (m == null) return i;
        m.setDisplayName(canClaim ? "§a§lRécupérer" : "§c§lDéjà récupéré");
        m.setLore(List.of(canClaim ? "§7Clic pour recevoir la récompense du jour" : "§7Reviens demain !"));
        i.setItemMeta(m);
        return i;
    }

    private static ItemStack makeCloseButton() {
        ItemStack i = new ItemStack(Material.BARRIER);
        ItemMeta m = i.getItemMeta();
        if (m != null) m.setDisplayName("§cFermer");
        i.setItemMeta(m);
        return i;
    }
}
