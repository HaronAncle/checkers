function BotTurnHard() {
  if (nessesary_eat) {
    //ход если бить надо
    let temp1 = nessesary_eat_list[0][nessesary_eat_list[0].length - 1];
    let x = setTimeout(imitate_click(temp1), 100);
  } else {
    let temp_bot_positions_list = [];
    for (let i = 1; i < 64; i++) {
      if (cells_info[i] == bot_color || cells_info[i] == bot_color + 2) {
        temp_bot_positions_list.push(i);
      }
    }
    let cur_bot_cheker;
    let temp;
    while (true) {
      if (temp_bot_positions_list.length == 0) {
        break;
      }
      temp = Math.floor(Math.random() * temp_bot_positions_list.length) % temp_bot_positions_list.length;
      cur_bot_cheker = temp_bot_positions_list[temp];
      if (!CheckPotentionForConcreate(cur_bot_cheker)) {
        temp_bot_positions_list.splice(temp, 1);
      } else {
        imitate_click(cur_bot_cheker);
        imitate_click(potention_cells[0]);
        break;
      }
    }
  }
}
