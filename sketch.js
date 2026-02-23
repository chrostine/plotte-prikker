let grid = []; // todimensionel array, der holder styr på alle celler af klassen Cell
let kolonner = 16;
let rækker = 10;
let antal = kolonner; // kontrollerer antallet af rækker og kolonner
let loc = 0; // bestemmer, hvordan cellerne placeres ift hinanden
let størrelse = 10; // størrelsen på cirklen der tegnes
let hastighed = 0.01; //hvor hurtigt cellerne bevæger sig rundt
let trueHastighed = hastighed;
let speedSwitch = false;
let seed = 0; // værdi til randomisering
let gemSvg = false;

function setup() {
  cnv = createCanvas(1132, 800);
  cnv.parent("main"); // gør det muligt at integrere vancas i HTML med id main

  // Forbind variabler med Shoelace elementer
  // for hver slider oprettes en event listener
  seedControl = document.getElementById("seed");
  seedControl.value = seed;
  seedControl.addEventListener("sl-input", (event) => {
    seed = seedControl.value;
    opdaterGrid(); // når en slider ændres, opdateres den tilknyttede variabel, og nogle gange genoprettes grid via opdaterGrid()
  });

  antalControl = document.getElementById("antal");
  antalControl.value = antal;
  antalControl.addEventListener("sl-input", (event) => {
    antal = antalControl.value;
    kolonner = rækker = antal; // Sikrer, at kolonner og rækker opdateres
    opdaterGrid();
  });

  locControl = document.getElementById("loc");
  locControl.value = loc;
  locControl.addEventListener("sl-input", (event) => {
    loc = locControl.value;
    opdaterGrid();
  });

  størrelseControl = document.getElementById("størrelse");
  størrelseControl.value = størrelse;
  størrelseControl.addEventListener("sl-input", (event) => {
    størrelse = størrelseControl.value;
  });

  hastighedControl = document.getElementById("hastighed");
  hastighedControl.value = hastighed;
  hastighedControl.addEventListener("sl-input", (event) => {
    hastighed = hastighedControl.value;
  });

  const lavNyControl = document.getElementById("lavNy");
  lavNyControl.addEventListener("click", (event) => {
    randomizeParameters();
  });

  opdaterGrid(); // Opretter grid initialt
}

function draw() {
  // start med at gemme en svg-fil, hvis variablen "gemSVG" true
  if (gemSvg == true) {
    beginRecordSVG(this, "myOutput.svg");
  }
  if (speedSwitch == true) {
    hastighed = 0;
  } else if (speedSwitch == false) {
    hastighed = trueHastighed;
  }
  tegn();
  // kalder tegn() i en løkker, der kører hele tiden. Sikrer, at animationen opdateres konstant
  // Afslut filen, hvis vi har været i gang med at gemme
  if (gemSvg == true) {
    endRecordSVG();
    gemSvg = false;
  }
}

function keyPressed() {
  if (key == "v" || key == "V") {
    gemSvg = true;
  }
  if (key == "s") {
    speedSwitch = !speedSwitch;
  }
}

function tegn() {
  background(255);
  for (let i = 0; i < kolonner; i++) {
    for (let j = 0; j < rækker; j++) {
      grid[i][j].opdater(); // opdaterer hver celles position
      grid[i][j].vis(); // tegner hver celle på canvas
    }
  }
}

function randomizeParameters() {
  randomSeed(millis()); // genererer tilfældige værdier for sliders ved at bruge random()
  seedControl.value = random(seedControl.min, seedControl.max);
  antalControl.value = random(antalControl.min, antalControl.max);
  hastighedControl.value = random(hastighedControl.min, hastighedControl.max);
  locControl.value = random(locControl.min, locControl.max);
  // størrelse ændres ud fra antal, så canva ikke bliver helt sort
  if (antalControl.value < antalControl.max / 3) {
    størrelseControl.value = random(størrelseControl.min, størrelseControl.max);
  } else if (antalControl.value > antalControl.max / 3) {
    størrelseControl.value = random(
      størrelseControl.min,
      størrelseControl.max / 2
    );
  }
  seedControl.dispatchEvent(
    // simulerer manual ændring af sliders ved at bruge dispatchEvent, så event listeners bliver aktieret
    new CustomEvent("sl-input", { detail: { value: seedControl.value } })
  );
  antalControl.dispatchEvent(
    new CustomEvent("sl-input", { detail: { value: antalControl.value } })
  );
  locControl.dispatchEvent(
    new CustomEvent("sl-input", { detail: { value: locControl.value } })
  );
  størrelseControl.dispatchEvent(
    new CustomEvent("sl-input", { detail: { value: størrelseControl.value } })
  );
  hastighedControl.dispatchEvent(
    new CustomEvent("sl-input", { detail: { value: hastighedControl.value } })
  );
}

function opdaterGrid() {
  // genskaber grid-arrayet baseret på aktuelle værdier for kolonner, rækker og loc
  grid = [];
  let unitRækker = height / rækker; // beregner cellernes placering og radius afhængigt af canvas størrelse
  let unitKolonner = width / kolonner;
  for (let i = 0; i < kolonner; i++) {
    grid[i] = [];
    for (let j = 0; j < rækker; j++) {
      grid[i][j] = new Cell(
        unitKolonner / 2 + i * unitKolonner,
        unitRækker / 2 + j * unitRækker,
        unitRækker / 2,
        i * loc + j * loc
      );
    }
  }
}

class Cell {
  constructor(x0, y0, r, angle) {
    this.r = r; // radius for cellernes bevægelse
    this.angle = angle; // startvinklen for bevægelsen
    this.x0 = x0; // cellernes centrale position
    this.y0 = y0; // cellernes centrale position
  }
  opdater() {
    // beregner cellernes aktuelle position (x og y) ud fra vinklen og radius
    this.x = this.r * cos(this.angle);
    this.y = this.r * sin(this.angle);
    this.angle += hastighed; // øger vinklen med hastighed, vhilket skaber cirkulær bevægelse
  }
  vis() {
    // tegner cellen som en ellipse på dens aktuelle position
    fill(0);
    ellipse(this.x0 + this.x, this.y0 + this.y, størrelse, størrelse);
  }
}
