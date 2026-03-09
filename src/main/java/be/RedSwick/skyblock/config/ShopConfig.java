package be.RedSwick.skyblock.config;

import be.RedSwick.skyblock.SkyBlockPlugin;
import be.RedSwick.skyblock.shop.ShopCategory;
import be.RedSwick.skyblock.shop.ShopItem;
import org.bukkit.Material;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.configuration.file.YamlConfiguration;

import java.io.File;
import java.util.*;

/**
 * Charge optionnellement shop.yml. Si une catégorie est présente, elle remplace les items de l'enum.
 */
public final class ShopConfig {

    private static Map<ShopCategory, List<ShopItem>> itemsByCategory = null;

    public static void load() {
        File file = new File(SkyBlockPlugin.getInstance().getDataFolder(), "shop.yml");
        if (!file.exists()) {
            SkyBlockPlugin.getInstance().saveResource("shop.yml", false);
        }
        if (!file.exists()) {
            itemsByCategory = null;
            return;
        }

        YamlConfiguration cfg = YamlConfiguration.loadConfiguration(file);
        Map<ShopCategory, List<ShopItem>> map = new HashMap<>();
        for (ShopCategory cat : ShopCategory.values()) {
            ConfigurationSection sec = cfg.getConfigurationSection(cat.name());
            if (sec == null) continue;
            List<?> list = sec.getList("items");
            if (list == null || list.isEmpty()) continue;
            List<ShopItem> items = new ArrayList<>();
            for (Object o : list) {
                if (!(o instanceof Map)) continue;
                @SuppressWarnings("unchecked")
                Map<String, Object> m = (Map<String, Object>) o;
                Material mat = Material.matchMaterial(String.valueOf(m.get("material")));
                if (mat == null) continue;
                String name = String.valueOf(m.getOrDefault("display-name", mat.name()));
                long buy = ((Number) m.getOrDefault("buy", 0)).longValue();
                long sell = ((Number) m.getOrDefault("sell", 0)).longValue();
                int gem = ((Number) m.getOrDefault("gem-price", 0)).intValue();
                if (buy == 0 && sell > 0) items.add(ShopItem.sellOnly(mat, name, sell));
                else if (gem > 0 && sell > 0) items.add(ShopItem.gemSell(mat, name, gem, sell));
                else if (gem > 0) items.add(ShopItem.gem(mat, name, gem));
                else items.add(ShopItem.of(mat, name, buy, sell));
            }
            if (!items.isEmpty()) map.put(cat, items);
        }
        itemsByCategory = map.isEmpty() ? null : map;
    }

    /** Retourne les items de la catégorie depuis la config, ou null pour utiliser l'enum. */
    public static List<ShopItem> getItems(ShopCategory category) {
        return itemsByCategory != null ? itemsByCategory.get(category) : null;
    }

    public static boolean isLoaded() {
        return itemsByCategory != null;
    }

    /** Carte matière → item pour la vente (utilisée par le shop et sell wand). */
    public static Map<Material, ShopItem> getSellMap() {
        if (itemsByCategory == null) return null;
        Map<Material, ShopItem> out = new HashMap<>();
        for (List<ShopItem> items : itemsByCategory.values()) {
            for (ShopItem si : items) {
                if (si.isSellable()) out.put(si.material(), si);
            }
        }
        return out;
    }
}
