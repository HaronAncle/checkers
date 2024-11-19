let bot_potentinal_list = [];
let player_color;
let bot_color;
let AI;

function BotAI() {
  if (game_mode == 1) {
    AI = setInterval(() => {
      if (current_player == bot_color) {
        if (current_difficult == 0) BotTurnEasy();
        else if (current_difficult == 1) BotTurnNormal();
        else if (current_difficult == 2) BotTurnHard();
        else BotTurnVeryHard();
      }
    }, 400);
  } else clearInterval(AI);
}
function BotTurnEasy() {
  if (nessesary_eat) {
    //ход если бить надо
    let temp1 = nessesary_eat_list[0][nessesary_eat_list[0].length - 1]; //позиция, на которую перемещается шашка
    let x = setTimeout(imitate_click(temp1), 100);
  } else {
    //ход без необходимого битья
    let temp_bot_positions_list = []; //генерирует информацию о местоположении шашек
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

function CheckPotentionForConcreate(i) {
  //i - позиция
  if (cells_info[i] != -1 && (cells_info[i] == current_player || cells_info[i] == current_player + 2)) {
    if (game_mode == 2 || (current_color == 1 && game_mode == 1)) {
      //для черных сверху
      if (current_player == 1) {
        if (cells_info[i] == 1) {
          if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) return true;
          if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) return true;
        } else if (cells_info[i] == 3) {
          if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) return true;
          if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) return true;
          if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) return true;
          if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) return true;
        }
      } else {
        if (cells_info[i] == 2) {
          if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) return true;
          if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) return true;
        } else if (cells_info[i] == 4) {
          if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) return true;
          if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) return true;
          if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) return true;
          if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) return true;
        }
      }
    } else {
      //для белых сверху
      if (current_player == 2) {
        if (cells_info[i] == 2) {
          if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) return true;

          if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) return true;
        } else if (cells_info[i] == 4) {
          if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) return true;
          if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) return true;
          if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) return true;
          if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) return true;
        }
      } else {
        if (cells_info[i] == 1) {
          if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) return true;
          if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) return true;
        } else if (cells_info[i] == 3) {
          if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) return true;
          if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) return true;
          if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) return true;
          if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) return true;
        }
      }
    }
  }
  return false;
}
