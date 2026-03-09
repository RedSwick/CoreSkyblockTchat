package be.RedSwick.skyblock.listener;

import be.RedSwick.skyblock.gui.IslandBankGUI;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.inventory.InventoryClickEvent;
import org.bukkit.event.inventory.InventoryDragEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;

import java.util.List;

public class IslandBankGUIListener implements Listener {

    @EventHandler
    public void onBankClick(InventoryClickEvent event) {
        if (!(event.getWhoClicked() instanceof Player player)) return;
        if (!event.getView().getTitle().equals(IslandBankGUI.TITLE)) return;

        event.setCancelled(true);

        ItemStack clicked = event.getCurrentItem();
        if (clicked == null) return;
        ItemMeta meta = clicked.getItemMeta();
        if (meta == null || !meta.hasLore()) return;

        List<String> lore = meta.getLore();
        if (lore == null) return;

        // Bouton Déposer
        if (lore.contains("§0ACT:bank_deposit")) {
            player.closeInventory();
            player.sendMessage("§6Banque d'île §8» §eTape §f/is bank deposit <montant> §epour déposer des coins.");
        }
        // Bouton Retirer
        else if (lore.contains("§0ACT:bank_withdraw")) {
            player.closeInventory();
            player.sendMessage("§6Banque d'île §8» §eTape §f/is bank withdraw <montant> §epour retirer des coins.");
        }
    }

    @EventHandler
    public void onBankDrag(InventoryDragEvent event) {
        if (!event.getView().getTitle().equals(IslandBankGUI.TITLE)) return;
        event.setCancelled(true);
    }
}
