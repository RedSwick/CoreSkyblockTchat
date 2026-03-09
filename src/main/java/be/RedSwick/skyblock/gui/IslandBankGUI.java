package be.RedSwick.skyblock.gui;

import be.RedSwick.skyblock.island.Island;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * GUI /is bank — Affiche le solde de la banque d'île et l'historique des transactions.
 */
public class IslandBankGUI {

    public static final String TITLE = "§6Banque de l'île";
    private static final SimpleDateFormat DATE_FMT = new SimpleDateFormat("dd/MM HH:mm");

    public static Inventory create(Island island) {
        Inventory inv = Bukkit.createInventory(null, 54, TITLE);

        // ── Bordure ──
        ItemStack pane = new ItemStack(Material.BLACK_STAINED_GLASS_PANE);
        ItemMeta pm = pane.getItemMeta();
        pm.setDisplayName("§r");
        pane.setItemMeta(pm);
        for (int i = 0; i < 9; i++)              inv.setItem(i, pane);
        for (int i = 45; i < 54; i++)            inv.setItem(i, pane);
        for (int i = 0; i < 54; i += 9)         inv.setItem(i, pane);
        for (int i = 8; i < 54; i += 9)         inv.setItem(i, pane);

        // ── Solde (centre haut) ──
        ItemStack balanceItem = new ItemStack(Material.GOLD_BLOCK);
        ItemMeta bm = balanceItem.getItemMeta();
        bm.setDisplayName("§6§lBanque de l'île");
        List<String> bLore = new ArrayList<>();
        bLore.add("§8▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
        bLore.add("§eSolde actuel : §f§l" + String.format("%,d", (long) island.getBankBalance()) + " §6coins");
        bLore.add("");
        bLore.add("§7Utilise §e/is bank deposit <montant>");
        bLore.add("§7ou §e/is bank withdraw <montant>");
        bm.setLore(bLore);
        balanceItem.setItemMeta(bm);
        inv.setItem(4, balanceItem);

        // ── Bouton Déposer ──
        ItemStack depositBtn = new ItemStack(Material.LIME_STAINED_GLASS_PANE);
        ItemMeta dm = depositBtn.getItemMeta();
        dm.setDisplayName("§a§l+ Déposer");
        dm.setLore(List.of("§7Tape §e/is bank deposit <montant>", "§0ACT:bank_deposit"));
        depositBtn.setItemMeta(dm);
        inv.setItem(47, depositBtn);

        // ── Bouton Retirer ──
        ItemStack withdrawBtn = new ItemStack(Material.RED_STAINED_GLASS_PANE);
        ItemMeta wm = withdrawBtn.getItemMeta();
        wm.setDisplayName("§c§l- Retirer");
        wm.setLore(List.of("§7Tape §e/is bank withdraw <montant>", "§0ACT:bank_withdraw"));
        withdrawBtn.setItemMeta(wm);
        inv.setItem(51, withdrawBtn);

        // ── Titre historique ──
        ItemStack histTitle = new ItemStack(Material.BOOK);
        ItemMeta hm = histTitle.getItemMeta();
        hm.setDisplayName("§e§lHistorique des transactions");
        hm.setLore(List.of("§7Les 20 dernières opérations"));
        histTitle.setItemMeta(hm);
        inv.setItem(13, histTitle);

        // ── Entrées d'historique (slots 19..43, sauf bordure) ──
        List<Island.BankTransaction> log = island.getBankLog();
        int[] histSlots = {19, 20, 21, 22, 23, 24, 25,
                           28, 29, 30, 31, 32, 33, 34,
                           37, 38, 39, 40, 41, 42};

        for (int i = 0; i < histSlots.length; i++) {
            if (i >= log.size()) break;
            Island.BankTransaction t = log.get(i);

            boolean isDeposit = t.deposit();
            ItemStack entry = new ItemStack(isDeposit ? Material.LIME_DYE : Material.RED_DYE);
            ItemMeta em = entry.getItemMeta();

            String prefix = isDeposit ? "§a▲ Dépôt" : "§c▼ Retrait";
            em.setDisplayName(prefix + " §f§l" + String.format("%,d", t.amount()) + " §6coins");
            List<String> eLore = new ArrayList<>();
            eLore.add("§7Par : §f" + t.playerName());
            eLore.add("§7Le  : §f" + DATE_FMT.format(new Date(t.timestamp())));
            em.setLore(eLore);
            entry.setItemMeta(em);
            inv.setItem(histSlots[i], entry);
        }

        // Si historique vide
        if (log.isEmpty()) {
            ItemStack empty = new ItemStack(Material.PAPER);
            ItemMeta emm = empty.getItemMeta();
            emm.setDisplayName("§7Aucune transaction pour l'instant");
            empty.setItemMeta(emm);
            inv.setItem(31, empty);
        }

        return inv;
    }
}
