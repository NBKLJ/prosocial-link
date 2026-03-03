

## Plan: Fix and Improve Configurações de Agendamento

### Problems Identified

1. **Layout issue**: 7 weekday cards in a `grid-cols-4` grid creates an uneven last row (4 + 3)
2. **Duplicate comment** on lines 7-9
3. **No remove slot button** - users can add slots but never remove them
4. **Overall visual quality** needs polish per user feedback

### Changes (single file: `src/pages/AgendaConfiguracoes.tsx`)

1. **Top settings row** - Keep the 3-column grid (Agenda Padrao, Duracao, Limite) but improve card styling with icons and better spacing

2. **Weekly schedule grid** - Change from `grid-cols-4` to a cleaner `grid-cols-7` single-row layout with compact day columns. Each column shows the day abbreviation, a toggle, and the time range selects vertically. This avoids the broken 4+3 layout

3. **Add slot removal** - Add an X button next to each extra time slot so users can remove them

4. **Reminders section** - Keep the current toggle + 5-option grid, but clean up spacing and ensure consistent card sizing

5. **General polish** - Remove duplicate comment, ensure consistent border-radius and padding, use the project's `glass-card` utility consistently

6. **Single save button** - Remove the duplicate save button (currently at top AND bottom), keep only the top one in the header

