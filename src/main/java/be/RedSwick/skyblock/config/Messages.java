package be.RedSwick.skyblock.config;

import be.RedSwick.skyblock.SkyBlockPlugin;
import org.bukkit.ChatColor;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.configuration.file.YamlConfiguration;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * Charge messages.yml et fournit get(key) avec remplacement de placeholders %key%.
 */
public final class Messages {

    private static FileConfiguration config;
    private static final Map<String, String> CACHE = new HashMap<>();

    public static void load() {
        File file = new File(SkyBlockPlugin.getInstance().getDataFolder(), "messages.yml");
        if (!file.exists()) {
            SkyBlockPlugin.getInstance().saveResource("messages.yml", false);
        }
        config = YamlConfiguration.loadConfiguration(file);
        CACHE.clear();
    }

    public static void reload() {
        load();
    }

    public static String get(String key) {
        return get(key, Map.of());
    }

    public static String get(String key, Map<String, String> placeholders) {
        String cached = CACHE.get(key);
        if (cached == null && config != null) {
            String raw = config.getString(key, "§c[Missing: " + key + "]");
            cached = raw == null ? key : ChatColor.translateAlternateColorCodes('&', raw);
            CACHE.put(key, cached);
        }
        if (cached == null) return key;
        if (placeholders == null || placeholders.isEmpty()) return cached;
        String out = cached;
        for (Map.Entry<String, String> e : placeholders.entrySet()) {
            out = out.replace("%" + e.getKey() + "%", e.getValue());
        }
        return out;
    }

    public static String get(String key, String k1, String v1) {
        return get(key, Map.of(k1, v1));
    }

    public static String get(String key, String k1, String v1, String k2, String v2) {
        return get(key, Map.of(k1, v1, k2, v2));
    }

    public static String prefix() {
        return get("prefix");
    }

    public static String get(String s, String day, String s1, String coins, String s2, String essence, String s3) {
        return s;
    }
}
