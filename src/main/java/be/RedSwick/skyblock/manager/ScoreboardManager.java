package be.RedSwick.skyblock.manager;

import be.RedSwick.skyblock.SkyBlockPlugin;
import be.RedSwick.skyblock.config.PluginConfig;
import be.RedSwick.skyblock.island.Island;
import be.RedSwick.skyblock.player.PlayerData;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.entity.Player;
import org.bukkit.scoreboard.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

/**
 * Affiche un scoreboard côté client avec niveau île, coins, essence, gemmes.
 * Placeholders: %level%, %coins%, %essence%, %gems%
 *
 * OPTIMISATION : le Scoreboard est créé UNE SEULE FOIS par joueur et réutilisé.
 * Seules les entrées sont effacées/recréées à chaque tick → pas de packet de
 * reconstruction de scoreboard, pas d'allocation d'objet → TPS préservés.
 */
public final class ScoreboardManager {

    private final SkyBlockPlugin plugin;
    // Cache : un Scoreboard par joueur, réutilisé à chaque mise à jour
    private final HashMap<UUID, Scoreboard> sbCache = new HashMap<>();

    public ScoreboardManager(SkyBlockPlugin plugin) {
        this.plugin = plugin;
    }

    public void updatePlayer(Player player) {
        if (!PluginConfig.isScoreboardEnabled()) {
            if (sbCache.remove(player.getUniqueId()) != null)
                player.setScoreboard(Bukkit.getScoreboardManager().getNewScoreboard());
            return;
        }

        List<String> lines = PluginConfig.getScoreboardLines();
        if (lines == null || lines.isEmpty()) return;

        PlayerData data   = plugin.getPlayerDataManager().get(player.getUniqueId());
        Island     island = plugin.getIslandManager().getIslandByMember(player.getUniqueId());

        String levelStr   = island != null ? String.format("%.1f", island.getIsLevel()) : "0";
        String coinsStr   = data != null ? formatNum(data.getCoins()) : "0";
        String essenceStr = data != null ? formatNum(data.getEssence()) : "0";
        String gemsStr    = data != null ? String.valueOf(data.getGems()) : "0";

        Scoreboard sb  = sbCache.get(player.getUniqueId());
        Objective  obj;

        if (sb == null) {
            // Première fois : créer et assigner
            sb  = Bukkit.getScoreboardManager().getNewScoreboard();
            String title = ChatColor.translateAlternateColorCodes('&', PluginConfig.getScoreboardTitle());
            obj = sb.registerNewObjective("arcanium", Criteria.DUMMY, title);
            obj.setDisplaySlot(DisplaySlot.SIDEBAR);
            sbCache.put(player.getUniqueId(), sb);
            player.setScoreboard(sb);
        } else {
            obj = sb.getObjective("arcanium");
            if (obj == null) {
                String title = ChatColor.translateAlternateColorCodes('&', PluginConfig.getScoreboardTitle());
                obj = sb.registerNewObjective("arcanium", Criteria.DUMMY, title);
                obj.setDisplaySlot(DisplaySlot.SIDEBAR);
            }
            // Effacer les anciennes entrées (les valeurs changent à chaque tick)
            for (String entry : new HashSet<>(sb.getEntries())) sb.resetScores(entry);
        }

        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i)
                    .replace("%level%",   levelStr)
                    .replace("%coins%",   coinsStr)
                    .replace("%essence%", essenceStr)
                    .replace("%gems%",    gemsStr);
            line = ChatColor.translateAlternateColorCodes('&', line);
            // Lignes vides : whitespace unique par position pour éviter les doublons
            String entry = line.isEmpty() ? " ".repeat(i + 1) : line;
            obj.getScore(entry).setScore(lines.size() - i);
        }
    }

    /** À appeler au logout du joueur pour libérer le cache. */
    public void removePlayer(UUID uuid) {
        sbCache.remove(uuid);
    }

    private static String formatNum(long n) {
        if (n >= 1_000_000_000) return (n / 1_000_000_000) + "G";
        if (n >= 1_000_000)     return (n / 1_000_000) + "M";
        if (n >= 1_000)         return (n / 1_000) + "K";
        return String.valueOf(n);
    }
}
