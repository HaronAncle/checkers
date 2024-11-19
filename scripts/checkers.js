document.getElementById("restart").onclick = restart;
let end_message = false;
let play_area = document.getElementById("play_area");
let cells_info = [];
for (let x = 0; x < 64; x++) {
  cells_info.push(-1);
}
let current_cheker = -1;
let potention_cells = [];
let current_player = 1; //1-white, 2-black
let nessesary_eat = false;
let nessesary_eat_list = [];
let cells;
let white_count = 12,
  black_count = 12;
///
///
///
function restart() {
  if (game_mode == 1) BotAI();
  else {
    clearInterval(AI);
  }
  potention_cells = [];
  current_player = 1;
  current_cheker = -1;
  nessesary_eat = false;
  nessesary_eat_list = [];
  play_area.innerHTML = "";
  black_count = 12;
  white_count = 12;
  if (current_color == 1) bot_color = 2;
  else bot_color = 1;
  bot_potentinal_list = [];
  player_color = current_color;
  end_message = false;
  let i = 0;

  while (i < 64) {
    if ((Math.floor(i / 8) + (i % 8)) % 2 == 0) play_area.innerHTML += "<div class='white_cell' pos='" + i + "'></div>";
    else play_area.innerHTML += "<div class='black_cell' pos='" + i + "'></div>";
    i++;
  }
  cells = document.querySelectorAll("div.white_cell, div.black_cell");
  for (let x = 0; x < 64; x++) {
    cells[x].onclick = clickButton;
    cells_info[x] = -1;
  }
  for (let x = 24; x < 40; x++) if ((Math.floor(x / 8) + (x % 8)) % 2 == 1) cells_info[x] = 0;
  //если остается -1 после заполнения - белая клетка, 0 - пуст черная, остальные номера чем-то заняты
  if (game_mode == 2 || (current_color == 1 && game_mode == 1)) {
    for (let x = 0; x < 24; x++) {
      if ((Math.floor(x / 8) + (x % 8)) % 2 == 1) {
        cells[x].innerHTML = "<img class='checker' src='materials/icons/black_checkers.png'>";
        cells_info[x] = 2; //2- простые черные 4-черная дамка
      }
    }

    for (let x = 40; x < 64; x++) {
      if ((Math.floor(x / 8) + (x % 8)) % 2 == 1) {
        cells[x].innerHTML = "<img class='checker' src='materials/icons/white_checkers.png'>";
        cells_info[x] = 1; //1 - простые белые 3- белая дамка
      }
    }
  } else {
    for (let x = 0; x < 24; x++) {
      if ((Math.floor(x / 8) + (x % 8)) % 2 == 1) {
        cells[x].innerHTML = "<img class='checker' src='materials/icons/white_checkers.png'>";
        cells_info[x] = 1;
      }
    }

    for (let x = 40; x < 64; x++) {
      if ((Math.floor(x / 8) + (x % 8)) % 2 == 1) {
        cells[x].innerHTML = "<img class='checker' src='materials/icons/black_checkers.png'>";
        cells_info[x] = 2;
      }
    }
  }
}
function clickButton() {
  let i = parseInt(this.getAttribute("pos"));
  imitate_click(i);
}
function imitate_click(i) {
  if (!nessesary_eat) {
    //если нет шашек для битья
    if (cells_info[i] != -1) {
      if (i != current_cheker) {
        let notmotion = true; //указывает, не было ли хода, если был, то ход передается другому
        for (let j = 0; j < potention_cells.length; j++) {
          if (i == potention_cells[j]) {
            //если нажатая клетка - клетка для возможного передвижения шашки
            if (game_mode == 2 || (current_color == 1 && game_mode == 1)) {
              if (i < 8 && current_player == 1 && cells_info[current_cheker] != 3) {
                //проверка на дамку для черных сверху
                cells[i].innerHTML = "<img class='checker' src='materials/icons/white_checkers_king.png'>";
                cells_info[i] = 3;
              } else if (i > 55 && current_player == 2 && cells_info[current_cheker] != 4) {
                cells[i].innerHTML = "<img class='checker' src='materials/icons/black_checkers_king.png'>";
                cells_info[i] = 4;
              } else {
                cells[i].innerHTML = cells[current_cheker].innerHTML; //передвигаем шашку
                cells_info[i] = cells_info[current_cheker];
              }
            } else {
              if (i > 55 && current_player == 1 && cells_info[current_cheker] != 3) {
                //проверка на дамку для белых сверху
                cells[i].innerHTML = "<img class='checker' src='materials/icons/white_checkers_king.png'>";
                cells_info[i] = 3;
              } else if (i < 8 && current_player == 2 && cells_info[current_cheker] != 4) {
                cells[i].innerHTML = "<img class='checker' src='materials/icons/black_checkers_king.png'>";
                cells_info[i] = 4;
              } else {
                cells[i].innerHTML = cells[current_cheker].innerHTML; //передвигаем шашку
                cells_info[i] = cells_info[current_cheker];
              }
            }

            potention_cells[j] = 0; //это зачем
            //убираем шашку
            cells_info[current_cheker] = 0;
            cells[current_cheker].innerHTML = "";
            current_cheker = -1;
            //конец убирания шашки

            notmotion = false;
            if (current_player == 1) current_player = 2;
            else current_player = 1;
            checkForEat();
            if (!CheckForTurn() && !nessesary_eat && !end_message) {
              message("Нет возможных ходов");
            }
            break;
          }
        }
        clearPotention();
        if (notmotion) {
          if (cells_info[i] == current_player || cells_info[i] == current_player + 2) {
            //проверяется, шашка этого игрока или нет (i - простая, i+2 - дамка)
            current_cheker = i;
            if (game_mode == 2 || (current_color == 1 && game_mode == 1)) {
              if (current_player == 1) {
                if (cells_info[current_cheker] == 1) {
                  if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) addPotention(i - 7);
                  if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) addPotention(i - 9);
                } else if (cells_info[current_cheker] == 3) {
                  //для дамки
                  if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) addPotention(i - 7);
                  if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) addPotention(i - 9);
                  if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) addPotention(i + 7);
                  if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) addPotention(i + 9);
                }
              } else {
                if (cells_info[current_cheker] == 2) {
                  if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) addPotention(i + 7);
                  if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) addPotention(i + 9);
                } else if (cells_info[current_cheker] == 4) {
                  //для дамки
                  if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) addPotention(i - 7);
                  if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) addPotention(i - 9);
                  if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) addPotention(i + 7);
                  if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) addPotention(i + 9);
                }
              }
            } else {
              //наоборот для белых сверху
              if (current_player == 2) {
                if (cells_info[current_cheker] == 2) {
                  if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) addPotention(i - 7);
                  if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) addPotention(i - 9);
                } else if (cells_info[current_cheker] == 4) {
                  //для дамки
                  if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) addPotention(i - 7);
                  if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) addPotention(i - 9);
                  if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) addPotention(i + 7);
                  if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) addPotention(i + 9);
                }
              } else {
                if (cells_info[current_cheker] == 1) {
                  if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) addPotention(i + 7);
                  if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) addPotention(i + 9);
                } else if (cells_info[current_cheker] == 3) {
                  //для дамки
                  if (i - 7 > 0 && (i - 7) / 8 != i / 8) if (cells_info[i - 7] == 0) addPotention(i - 7);
                  if (i - 9 > 0 && (i - 9) / 8 != i / 8) if (cells_info[i - 9] == 0) addPotention(i - 9);
                  if (i + 7 < 64 && (i + 7) / 8 != i / 8) if (cells_info[i + 7] == 0) addPotention(i + 7);
                  if (i + 9 < 64 && (i + 9) / 8 != i / 8) if (cells_info[i + 9] == 0) addPotention(i + 9);
                }
              }
            }
          } else clearPotention();
        }
      }
    } else clearPotention();
  } else {
    //шашки для битья есть
    console.log("Bit");
    if (cells_info[i] != -1) {
      for (let k = 0; k < nessesary_eat_list.length; k++) {
        if (i == nessesary_eat_list[k][nessesary_eat_list[k].length - 1]) {
          //если нажатая клетка - клетка для возможного передвижения и битья шашки
          for (let i1 = 0; i1 < nessesary_eat_list.length; i1++) {
            for (let j1 = 2; j1 < nessesary_eat_list[i1].length; j1 = j1 + 2) {
              cells[nessesary_eat_list[i1][j1]].innerHTML = ""; //очищаем меченые
            }
          }
          for (let j = 1; j < nessesary_eat_list[k].length; j += 2) {
            //убираем битые
            cells[nessesary_eat_list[k][j]].innerHTML = "";
            cells_info[nessesary_eat_list[k][j]] = 0;
            if (current_player == 1) {
              black_count--;
              console.log(black_count); //заменить на поле прорисовки
            } else {
              white_count--;
              console.log(white_count);
            }
          }
          //передвигаем щашку и проверяем ее на дамку
          current_cheker = nessesary_eat_list[k][0];
          if (game_mode == 2 || (current_color == 1 && game_mode == 1)) {
            if (i < 8 && current_player == 1 && cells_info[current_cheker] != 3) {
              //проверка на дамку для черных сверху
              cells[i].innerHTML = "<img class='checker' src='materials/icons/white_checkers_king.png'>";
              cells_info[i] = 3;
            } else if (i > 55 && current_player == 2 && cells_info[current_cheker] != 4) {
              cells[i].innerHTML = "<img class='checker' src='materials/icons/black_checkers_king.png'>";
              cells_info[i] = 4;
            } else {
              cells[i].innerHTML = cells[current_cheker].innerHTML; //передвигаем шашку
              cells_info[i] = cells_info[current_cheker];
            }
          } else {
            if (i > 55 && current_player == 1 && cells_info[current_cheker] != 3) {
              //проверка на дамку для белых сверху
              cells[i].innerHTML = "<img class='checker' src='materials/icons/white_checkers_king.png'>";
              cells_info[i] = 3;
            } else if (i < 8 && current_player == 2 && cells_info[current_cheker] != 4) {
              cells[i].innerHTML = "<img class='checker' src='materials/icons/black_checkers_king.png'>";
              cells_info[i] = 4;
            } else {
              cells[i].innerHTML = cells[current_cheker].innerHTML; //передвигаем шашку
              cells_info[i] = cells_info[current_cheker];
            }
          }
          //убираем шашку со старого места
          cells_info[current_cheker] = 0;
          cells[current_cheker].innerHTML = "";
          if (white_count == 0) {
            alert("Черные побелили");
            end_message = true;
          } else if (black_count == 0) {
            end_message = true;
            alert("Белые побелили");
          }
          if (current_player == 1) current_player = 2;
          else current_player = 1;
          clearPotention();
          nessesary_eat = false;
          nessesary_eat_list = [];
          checkForEat();
          if (!CheckForTurn() && !nessesary_eat && !end_message) {
            message("Нет возможных ходов");
          }
          break;
        }
      }
    }
  }
}
function clearPotention() {
  potention_cells.forEach((elem) => {
    cells[elem].innerHTML = "";
  });
  potention_cells = [];
  current_cheker = -1;
}

function addPotention(r) {
  cells[r].innerHTML += "<img class='checker' src='materials/icons/potentional.png'>";
  potention_cells.push(r);
}

function checkForEat() {
  clearPotention();
  nessesary_eat_list = [];
  nessesary_eat = false;
  checkForBit();
  if (nessesary_eat_list.length == 0) nessesary_eat = false;
  else {
    nessesary_eat = true;
    DrowNessesary();
  }
}

function checkForBit() {
  let temp;
  let enemy1;
  if (current_player == 1) enemy1 = 2;
  else enemy1 = 1;
  for (let i = 0; i < 64; i++) {
    if (cells_info[i] == current_player || cells_info[i] == current_player + 2) {
      //если простая или дамка
      if (i - 7 > 0 && (i - 7) / 8 != i / 8) {
        temp = i - 7;
        if ((cells_info[temp] == enemy1 || cells_info[temp] == enemy1 + 2) && temp - 7 > 0 && (temp - 7) / 8 != temp / 8) {
          if (cells_info[temp - 7] == 0) {
            nessesary_eat_list.push([i, temp, temp - 7]); //0-откуда, 1 - что съедается, 2 - куда идут
            Bit(nessesary_eat_list.length - 1, temp - 7, temp);
          }
        }
      }

      if (i - 9 > 0 && (i - 9) / 8 != i / 8) {
        temp = i - 9;
        if ((cells_info[temp] == enemy1 || cells_info[temp] == enemy1 + 2) && temp - 9 > 0 && (temp - 9) / 8 != temp / 8) {
          if (cells_info[temp - 9] == 0) {
            nessesary_eat_list.push([i, temp, temp - 9]); //0-откуда, 1 - что съедается, 2 - куда идут
            Bit(nessesary_eat_list.length - 1, temp - 9, temp);
          }
        }
      }

      if (i + 7 < 64 && (i + 7) / 8 != i / 8) {
        temp = i + 7;
        if ((cells_info[temp] == enemy1 || cells_info[temp] == enemy1 + 2) && temp + 7 < 64 && (temp + 7) / 8 != temp / 8) {
          if (cells_info[temp + 7] == 0) {
            nessesary_eat_list.push([i, temp, temp + 7]); //0-откуда, 1 - что съедается, 2 - куда идут
            Bit(nessesary_eat_list.length - 1, temp + 7, temp);
          }
        }
      }

      if (i + 9 < 64 && (i + 9) / 8 != i / 8) {
        temp = i + 9;
        if ((cells_info[temp] == enemy1 || cells_info[temp] == enemy1 + 2) && temp + 9 < 64 && (temp + 9) / 8 != temp / 8) {
          if (cells_info[temp + 9] == 0) {
            nessesary_eat_list.push([i, temp, temp + 9]); //0-откуда, 1 - что съедается, 2 - куда идут
            Bit(nessesary_eat_list.length - 1, temp + 9, temp);
          }
        }
      }
    }
  }
}

function Bit(x, i, from) {
  //х - номер пути элемента, i - проверяемая шашка, from - откуда
  //функция добавления в массив необходимого битья, если оно часть пути шашки
  let enemy;
  let temp;
  let count = 0;
  if (current_player == 1) enemy = 2;
  else enemy = 1;
  if (i - 7 != from && i - 7 > 0 && (i - 7) / 8 != i / 8) {
    temp = i - 7;
    if ((cells_info[temp] == enemy || cells_info[temp] == enemy + 2) && temp - 7 > 0 && (temp - 7) / 8 != temp / 8) {
      if (cells_info[temp - 7] == 0) {
        nessesary_eat_list.push(nessesary_eat_list[x]);
        nessesary_eat_list[x].push(temp, temp - 7); //temp - что съедается, 2 - куда идут
        Bit(x, temp - 7, temp);
        count++;
        x++;
      }
    }
  }

  if (i - 9 != from && i - 9 > 0 && (i - 9) / 8 != i / 8) {
    temp = i - 9;
    if ((cells_info[temp] == enemy || cells_info[temp] == enemy + 2) && temp - 9 > 0 && (temp - 9) / 8 != temp / 8) {
      if (cells_info[temp - 9] == 0) {
        nessesary_eat_list.push(nessesary_eat_list[x]);
        nessesary_eat_list[x].push(temp, temp - 9); //temp - что съедается, 2 - куда идут
        Bit(x, temp - 9, temp);
        count++;
        x++;
      }
    }
  }

  if (i + 7 != from && i + 7 < 64 && (i + 7) / 8 != i / 8) {
    temp = i + 7;
    if ((cells_info[temp] == enemy || cells_info[temp] == enemy + 2) && temp + 7 < 64 && (temp + 7) / 8 != temp / 8) {
      if (cells_info[temp + 7] == 0) {
        nessesary_eat_list.push(nessesary_eat_list[x]);
        nessesary_eat_list[x].push(temp, temp + 7); //temp - что съедается, 2 - куда идут
        Bit(x, temp + 7, temp);
        count++;
        x++;
      }
    }
  }

  if (i + 9 != from && i + 9 < 64 && (i + 9) / 8 != i / 8) {
    temp = i + 9;
    if ((cells_info[temp] == enemy || cells_info[temp] == enemy + 2) && temp + 9 < 64 && (temp + 9) / 8 != temp / 8) {
      if (cells_info[temp + 9] == 0) {
        nessesary_eat_list.push(nessesary_eat_list[x]);
        nessesary_eat_list[x].push(temp, temp + 9); //temp - что съедается, 2 - куда идут
        Bit(x, temp + 9, temp);
        count++;
        x++;
      }
    }
  }
  if (count != 0) {
    nessesary_eat_list.pop();
  }
}
function DrowNessesary() {
  //функция прорисовки необходимых клеток для битья
  for (let i = 0; i < nessesary_eat_list.length; i++) {
    for (let j = 2; j < nessesary_eat_list[i].length; j = j + 2) {
      cells[nessesary_eat_list[i][j]].innerHTML = "<img class='checker' src='materials/icons/potentional.png'>";
    }
  }
}
function CheckForTurn() {
  //проверяет на возможность хода
  //не учитывает возможность битья
  let temp = 0;
  for (let i = 1; i < 64; i++) {
    if (cells_info[i] != -1 && (cells_info[i] == current_player || cells_info[i] == current_player + 2)) {
      if (game_mode == 2 || (current_color == 1 && game_mode == 1)) {
        if (current_player == 1) {
          if (cells_info[i] == 1) {
            if (i - 7 > 0 && (i - 7) / 8 != i / 8)
              if (cells_info[i - 7] == 0) {
                return true;
              }
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
        if (current_player == 2) {
          if (cells_info[i] == 2) {
            if (i - 7 > 0 && (i - 7) / 8 != i / 8)
              if (cells_info[i - 7] == 0) {
                return true;
              }
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
      temp++;
      if (current_player == 1) {
        if (temp >= white_count) return false;
      } else {
        if (temp >= black_count) return false;
      }
    }
  }
  return false;
}
function message(mes) {
  alert(mes);
}
