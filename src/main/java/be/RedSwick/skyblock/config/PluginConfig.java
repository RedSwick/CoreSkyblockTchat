package be.RedSwick.skyblock.config;

import be.RedSwick.skyblock.SkyBlockPlugin;
import org.bukkit.configuration.file.FileConfiguration;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Charge et expose config.yml (île, cooldowns, banque, daily, vote, scoreboard, schematic).
 */
public final class PluginConfig {

    private static FileConfiguration config;

    public static void load() {
        SkyBlockPlugin.getInstance().saveDefaultConfig();
        config = SkyBlockPlugin.getInstance().getConfig();
    }

    public static void reload() {
        SkyBlockPlugin.getInstance().reloadConfig();
        config = SkyBlockPlugin.getInstance().getConfig();
    }

    // ════════════════════════════════════════════════
    //  ÎLE
    // ════════════════════════════════════════════════

    public static int getIslandDefaultRadius() {
        return config.getInt("island.default-radius", 50);
    }

    public static int getIslandMaxHomesDefault() {
        return config.getInt("island.max-homes-default", 3);
    }

    public static boolean isIslandMaxHomesFromUpgrade() {
        return config.getBoolean("island.max-homes-upgrade", false);
    }

    public static int getIslandMaxCoopMembers() {
        return config.getInt("island.max-coop-members", 4);
    }

    // ════════════════════════════════════════════════
    //  COOLDOWNS (secondes)
    // ════════════════════════════════════════════════

    public static int getCooldownIslandGo() {
        return config.getInt("cooldowns.island-go", 5);
    }

    public static int getCooldownIslandHome() {
        return config.getInt("cooldowns.island-home", 3);
    }

    public static int getCooldownVisit() {
        return config.getInt("cooldowns.visit", 10);
    }

    // ════════════════════════════════════════════════
    //  BANQUE
    // ════════════════════════════════════════════════

    public static boolean isBankEnabled() {
        return config.getBoolean("bank.enabled", true);
    }

    public static boolean isBankInterestEnabled() {
        return config.getBoolean("bank.interest-enabled", true);
    }

    public static double getBankInterestPercentPerDay() {
        return config.getDouble("bank.interest-percent-per-day", 2.0);
    }

    public static int getBankInterestIntervalHours() {
        return config.getInt("bank.interest-interval-hours", 24);
    }

    // ════════════════════════════════════════════════
    //  DAILY
    // ════════════════════════════════════════════════

    public static boolean isDailyEnabled() {
        return config.getBoolean("daily.enabled", true);
    }

    public static int getDailyResetHourUtc() {
        return config.getInt("daily.reset-hour-utc", 0);
    }

    public static int getDailyMaxStreak() {
        return config.getInt("daily.max-streak", 30);
    }

    /** Récompenses par jour (index 0 = jour 1). Chaque entrée: coins, essence, gems (optionnel). */
    public static List<Map<String, Number>> getDailyRewards() {
        List<?> list = config.getList("daily.rewards", List.of());
        List<Map<String, Number>> out = new ArrayList<>();
        for (Object o : list) {
            if (o instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> m = (Map<String, Object>) o;
                Map<String, Number> row = new HashMap<>();
                if (m.get("coins") instanceof Number) row.put("coins", (Number) m.get("coins"));
                else row.put("coins", 0);
                if (m.get("essence") instanceof Number) row.put("essence", (Number) m.get("essence"));
                else row.put("essence", 0);
                if (m.get("gems") instanceof Number) row.put("gems", (Number) m.get("gems"));
                else row.put("gems", 0);
                out.add(row);
            }
        }
        return out;
    }

    // ════════════════════════════════════════════════
    //  VOTE
    // ════════════════════════════════════════════════

    public static boolean isVoteEnabled() {
        return config.getBoolean("vote.enabled", true);
    }

    public static int getVoteCooldownHours() {
        return config.getInt("vote.cooldown-hours", 24);
    }

    public static long getVoteRewardCoins() {
        return config.getLong("vote.rewards.coins", 500);
    }

    public static long getVoteRewardEssence() {
        return config.getLong("vote.rewards.essence", 50);
    }

    // ════════════════════════════════════════════════
    //  SCOREBOARD
    // ════════════════════════════════════════════════

    public static boolean isScoreboardEnabled() {
        return config.getBoolean("scoreboard.enabled", true);
    }

    public static long getScoreboardUpdateTicks() {
        return config.getLong("scoreboard.update-ticks", 40L);
    }

    public static String getScoreboardTitle() {
        return config.getString("scoreboard.title", "§6§lArcanium");
    }

    public static List<String> getScoreboardLines() {
        return config.getStringList("scoreboard.lines");
    }

    // ════════════════════════════════════════════════
    //  SCHEMATIC
    // ════════════════════════════════════════════════

    public static boolean isSchematicEnabled() {
        return config.getBoolean("schematic.enabled", true);
    }

    public static String getSchematicFileName() {
        return config.getString("schematic.file-name", "ile Skyblock.litematic");
    }

    public static int getSchematicPasteOffsetY() {
        return config.getInt("schematic.paste-offset-y", 0);
    }
}
