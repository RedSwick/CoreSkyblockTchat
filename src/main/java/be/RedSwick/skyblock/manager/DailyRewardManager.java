package be.RedSwick.skyblock.manager;

import be.RedSwick.skyblock.SkyBlockPlugin;
import be.RedSwick.skyblock.config.PluginConfig;
import be.RedSwick.skyblock.player.PlayerData;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Gère la logique des récompenses quotidiennes (streak, reset à minuit UTC).
 */
public final class DailyRewardManager {

    /** Retourne le jour actuel (depuis epoch) en jours UTC pour comparaison. */
    public static long getCurrentDayUtc() {
        return System.currentTimeMillis() / (24 * 60 * 60 * 1000L);
    }

    /** Vérifie si le joueur peut claim aujourd'hui. */
    public boolean canClaim(UUID playerId) {
        PlayerData data = SkyBlockPlugin.getInstance().getPlayerDataManager().get(playerId);
        if (data == null) return false;
        long last = data.getLastDailyReward();
        if (last == 0) return true;
        long lastDay = last / (24 * 60 * 60 * 1000L);
        long today = getCurrentDayUtc();
        return lastDay < today;
    }

    /** Calcule le prochain streak après un claim. */
    public int getNextStreak(UUID playerId) {
        PlayerData data = SkyBlockPlugin.getInstance().getPlayerDataManager().get(playerId);
        if (data == null) return 1;
        long last = data.getLastDailyReward();
        if (last == 0) return 1;
        long lastDay = last / (24 * 60 * 60 * 1000L);
        long today = getCurrentDayUtc();
        int diff = (int) (today - lastDay);
        if (diff == 1) return Math.min(PluginConfig.getDailyMaxStreak(), data.getDailyStreak() + 1);
        if (diff > 1) return 1;
        return data.getDailyStreak();
    }

    /** Donne la récompense du jour. Retourne la récompense appliquée. */
    public Map<String, Number> claim(UUID playerId) {
        PlayerDataManager pdm = SkyBlockPlugin.getInstance().getPlayerDataManager();
        PlayerData data = pdm.get(playerId);
        if (data == null) return Map.of();

        int dayIndex = getNextStreak(playerId) - 1;
        List<Map<String, Number>> rewards = PluginConfig.getDailyRewards();
        if (rewards.isEmpty()) return Map.of();
        Map<String, Number> reward = rewards.get(Math.min(dayIndex, rewards.size() - 1));

        long coins   = reward.getOrDefault("coins", 0).longValue();
        long essence = reward.getOrDefault("essence", 0).longValue();
        int  gems    = reward.getOrDefault("gems", 0).intValue();

        int nextStreak = getNextStreak(playerId);
        data.setLastDailyReward(System.currentTimeMillis());
        data.setDailyStreak(nextStreak);
        data.addCoins(coins);
        data.addEssence(essence);
        if (gems > 0) data.addGems(gems);
        pdm.savePlayerAsync(playerId);

        return reward;
    }
}
