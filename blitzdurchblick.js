var BDB  = (function () {
  // Definiere eine Funktion mit einem Funktionsausdruck,
  // durch runde Klammern umschlossen

  var privateEigenschaft = "privat";

  var elem = {
    rndNum: null,
    intro: null,
    game: null,
    settings: null,
    btnSolve: null,
    impressum: null,
  }

  var settings = {
    gameType: 0,
    numberLength: 3,
    amount: 3,         // how many different numbers or images
    showRepeats: 3,    // how many times show each number or image
    objMove: false,    // changing position for each object
    repMove: false,    // changing position for each repetition
    showMs: 150,
    hideMs: 750,
  }

  var status = {
    toDisplay: null,                  // will contain the objects (numbers/images) to display
    toDisplayIndex: -1,               // current image to display (count up)
    curRepeat: settings.showRepeats,   // countdown how many times to display
    imprOn: false,
  }

  /** Fills settings object with values from form */
  function getValues ()
  {
    // TODO parse value for game type (now only 0, hardcoded)
    settings.gameType = 0;
    settings.numberLength = parseInt(document.getElementById("numLen").value);
    settings.amount = parseInt(document.getElementById("amount").value);
    settings.showRepeats = parseInt(document.getElementById("repeat").value);
    settings.showMs = parseInt(document.getElementById("showtime").value);
    settings.hideMs = parseInt(document.getElementById("hidetime").value);

    settings.objMove = document.getElementById("dispChangeLoc").checked;
    settings.repMove = document.getElementById("repeatChangeLoc").checked;
  }

  /** Switches display and memory to next image (but does not set any timeouts). */
  function displayNext ()
  {
    if (settings.objMove) {
      // move next number/image to new position
      var pos = BDBdata.getRandomPosition ();
      //window.alert ("randomPosition: x=" + pos.x + ", y=" + pos.y);
      setNumberPosition (pos.x, pos.y);
    }

    status.curRepeat = settings.showRepeats - 1;
    status.toDisplayIndex = status.toDisplayIndex + 1;
    status.toDisplay[status.toDisplayIndex].displayMe (elem.rndNum);
  }

  /** Manages the timeouts to show and hide the numbers or images. */
  function blink ()
  {
    showNumberOff ();

    // TODO work with settings.repMove ==> set new position

    var t1Time = settings.hideMs;
    var t2Time = settings.hideMs + settings.showMs;
    if (status.curRepeat > 0)
    {
      status.curRepeat = status.curRepeat - 1;
      var t1 = setTimeout(showNumberOn, t1Time);
      var t2 = setTimeout(blink, t2Time);
    }
    else if (status.toDisplayIndex < settings.amount - 1)
    {
      // status.curRepeat == 0 ==> switch to next image
      // status.toDisplayIndex < settings.amount ==> there is a next image
      displayNext ();
      var t1 = setTimeout(showNumberOn, t1Time);
      var t2 = setTimeout(blink, t2Time);
    }
    else {
      // this was the last repeat of the last image, nothing more to display
      // enable solution button
      elem.btnSolve.removeAttribute('disabled');
    }
  }

  function showNumberOn ()
  {
    elem.rndNum.style.visibility = "visible";
  }

  function showNumberOff ()
  {
    elem.rndNum.style.visibility = "hidden";
  }

  /** set position of number (left and top are Strings like "50px") */
  function setNumberPosition (left, top) {
    elem.rndNum.style.left = left;
    elem.rndNum.style.top = top;
  }

  /** debug function */
  function getRepeatStatusString () {
    return "image: " + status.toDisplayIndex + "/" + settings.amount
      + ", rep: " + status.curRepeat + "/" + settings.showRepeats;
  }

  // Direkt das Object mit der öffentlichen Schnittstelle zurückgeben
  return {

    init: function ()
    {
      elem.rndNum = document.getElementById("rndNum");
      elem.intro = document.getElementById("intro");
      elem.game = document.getElementById("game");
      elem.settings = document.getElementById("settings");

      elem.btnSolve = document.getElementById("solveGame");
      elem.impressum = document.getElementById("impressum");

      status.imprOn = false;

      return null;
    },

    startGame: function ()
    {
      getValues ();

      // get data and init loops
      status.toDisplay = BDBdata.initData (settings.gameType, settings.amount, settings.numberLength);
      status.toDisplayIndex = -1;   // because we will call displayNext to start

      // switch screen
      BDB.displayGameOnly ();
      elem.rndNum.style.display = "block";
      elem.rndNum.style.visibility = "visible";
      elem.btnSolve.setAttribute('disabled','disabled');

      // start displaying
      displayNext ();
      // The repetition counter in the blink method assumes that currently
      // an image is being displayed. As this is not the case just now,
      // the first image would be displayed one repetition short.
      // So to force one more repetition, we increase curRepeat:
      status.curRepeat = status.curRepeat + 1;
      blink ();
    },

    solveGame: function ()
    {
      BDB.displayGameOnly ();
      setNumberPosition ("10px", "10px");
      BDBdata.displayInElement (elem.rndNum, status.toDisplay);
      showNumberOn ();
    },

    displayIntroOnly: function ()
    {
      elem.intro.style.display = "block";
      elem.settings.style.display = "none";
      elem.game.style.display = "none";
    },

    displaySettingsOnly: function ()
    {
      elem.intro.style.display = "none";
      elem.settings.style.display = "block";
      elem.game.style.display = "none";
    },

    displayGameOnly: function ()
    {
      elem.intro.style.display = "none";
      elem.settings.style.display = "none";
      elem.game.style.display = "block";
    },

    toggleImpressum: function ()
    {
      if (status.imprOn)
        elem.impressum.style.display = "none";
      else
        elem.impressum.style.display = "block";
      status.imprOn = !(status.imprOn);
    },

  };
})();
// Ende des eingeklammerten Funktionsausdrucks, dahinter
// direkt () zum Aufruf der soeben definierten Funktion

//BDB.öffentlicheMethode1();

// Ergibt undefined, weil von außen nicht sichtbar:
//window.alert("Container.privateMethode von außerhalb: " + BDB.privateMethode);
