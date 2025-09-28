package de.beatme.voting;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultEntry {
    private String userId;
    private int points;
}

