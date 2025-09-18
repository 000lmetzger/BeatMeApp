package de.beatme.logging;

import lombok.extern.java.Log;

@Log
public class LogController {

    private static final String RESET = "\u001B[0m";
    private static final String BOLD = "\u001B[1m";

    private static final String RED = "\u001B[31m";
    private static final String GREEN = "\u001B[32m";

    public static void logSuccess(String message) {
        log.info("");
        log.info(GREEN + "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔" + RESET);
        log.info(GREEN + BOLD + message + RESET);
        log.info(GREEN + "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔" + RESET);
        log.info("");
    }

    public static void logError(String message) {
        log.severe("");
        log.severe(RED + "✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘" + RESET);
        log.severe(RED + BOLD + message + RESET);
        log.severe(RED + "✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘ ✘" + RESET);
        log.severe("");
    }
}
