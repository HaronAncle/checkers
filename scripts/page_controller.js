let rule_button = document.getElementById("rules");
let close_rules = document.getElementById("message_ok");
let game_1 = document.getElementById("play");
let start_game = document.getElementById("start");
let home = document.getElementById("home");
let game_mode_bot = document.getElementById("game_mode_bot");
let game_mode_person = document.getElementById("game_mode_person");
let difficult_less = document.getElementById("difficult_less");
difficult_less.classList.add("active");
let difficult_large = document.getElementById("difficult_larger");
difficult_large.classList.add("active");
let white_choose_color = document.getElementById("color_white");
let black_choose_color = document.getElementById("color_black");
black_choose_color.style.opacity = 0.5;
let random_choose_color = document.getElementById("color_random");
random_choose_color.style.opacity = 0.5;
let current_difficult = 1; //для сложности
let current_color = 1; //1-белый цвет, 2 - за черных
let game_mode = 0; //1 - бот, 2 - человек

rule_button.onclick = function () {
  document.getElementById("rules_text").style.visibility = "visible";
};
document.getElementById("help").onclick = function () {
  document.getElementById("rules_text").style.visibility = "visible";
};
close_rules.onclick = function () {
  document.getElementById("rules_text").style.visibility = "hidden";
};

game_1.onclick = function () {
  document.getElementById("main_menu").style.visibility = "hidden";
  home.style.visibility = "visible";
  document.getElementById("game_mode").style.visibility = "visible";
};

home.onclick = function () {
  clearInterval(AI);
  document.getElementById("main_menu").style.visibility = "visible";
  document.getElementById("options").style.visibility = "hidden";
  document.getElementById("checkers").style.visibility = "hidden";
  document.getElementById("game_mode").style.visibility = "hidden";
  home.style.visibility = "hidden";
  current_difficult = 1;
  current_color = 1;
  game_mode = 0;
  view_dif(1);
  black_choose_color.style.opacity = 0.5;
  random_choose_color.style.opacity = 0.5;
  white_choose_color.style.opacity = 1;
  difficult_less.classList.remove("dont_active");
  difficult_large.classList.remove("dont_active");
};

game_mode_bot.onclick = function () {
  game_mode = 1;
  document.getElementById("game_mode").style.visibility = "hidden";
  document.getElementById("options").style.visibility = "visible";
};
game_mode_person.onclick = function () {
  game_mode = 2;
  document.getElementById("game_mode").style.visibility = "hidden";
  document.getElementById("options").style.visibility = "hidden";
  document.getElementById("checkers").style.visibility = "visible";
  restart();
};

difficult_large.onclick = function () {
  if (current_difficult != 3) {
    current_difficult += 1;
    if (current_difficult == 1) {
      difficult_less.classList.add("active");
      difficult_less.classList.remove("dont_active");
    }
    view_dif(current_difficult);
    if (current_difficult == 3) {
      difficult_large.classList.remove("active");
      difficult_large.classList.add("dont_active");
    }
  }
};

difficult_less.onclick = function () {
  if (current_difficult != 0) {
    current_difficult -= 1;
    if (current_difficult == 2) {
      difficult_large.classList.add("active");
      difficult_large.classList.remove("dont_active");
    }
    view_dif(current_difficult);
    if (current_difficult == 0) {
      difficult_less.classList.remove("active");
      difficult_less.classList.add("dont_active");
    }
  }
};

function view_dif(x) {
  switch (x) {
    case 0:
      document.getElementById("view_difficult").innerHTML = "Легко";
      break;
    case 1:
      document.getElementById("view_difficult").innerHTML = "Нормально";
      break;
    case 2:
      document.getElementById("view_difficult").innerHTML = "Сложно";
      break;
    case 3:
      document.getElementById("view_difficult").innerHTML = "Очень сложно";
      break;
  }
}

white_choose_color.onclick = function () {
  if (current_color != 1) {
    current_color = 1;
    white_choose_color.style.opacity = 1;
    black_choose_color.style.opacity = 0.5;
    random_choose_color.style.opacity = 0.5;
  }
};
black_choose_color.onclick = function () {
  if (current_color != 2) {
    current_color = 2;
    white_choose_color.style.opacity = 0.5;
    black_choose_color.style.opacity = 1;
    random_choose_color.style.opacity = 0.5;
  }
};
random_choose_color.onclick = function () {
  if (current_color != 0) {
    current_color = 0;
    white_choose_color.style.opacity = 0.5;
    black_choose_color.style.opacity = 0.5;
    random_choose_color.style.opacity = 1;
  }
};

start_game.onclick = function () {
  document.getElementById("options").style.visibility = "hidden";
  document.getElementById("checkers").style.visibility = "visible";
  if (current_color == 0) current_color = (Math.round(Math.random() * 777) % 2) + 1;
  restart();
};
