var BDB  = (function () {
  // Definiere eine Funktion mit einem Funktionsausdruck,
  // durch runde Klammern umschlossen

  var privateEigenschaft = "privat";

// TODO zusammenfassen in elem-Objekt (assoziatives Array)
  var elem = {
    rndNum: null,
    intro: null,
    game: null,
    settings: null,
    btnSolve: null,
  }

  var settings = {
    gameType: 0,
    numberLength: 3,
    amount: 3,         // how many different numbers or images
    showRepeats: 3,    // how many times show each number or image
    showMs: 150,
    hideMs: 750,
    //text: "357",
  }

  var status = {
    toDisplay: null,
    toDisplayIndex: -1,               // current image to display (count up)
    curRepeat: settings.showRepeats   // countdown how many times to display
  }


  function getValues ()
  {
    //window.alert("getValues wurde aufgerufen");

    // TODO parse value for game type (now only 0, hardcoded)
    settings.gameType = 0;
    settings.numberLength = parseInt(document.getElementById("numLen").value);
    settings.amount = parseInt(document.getElementById("amount").value);
    settings.showRepeats = parseInt(document.getElementById("repeat").value);
    settings.showMs = parseInt(document.getElementById("showtime").value);
    settings.hideMs = parseInt(document.getElementById("hidetime").value);
  }

  /** Switches display and memory to next image (but does not set any timeouts). */
  function displayNext ()
  {
    status.curRepeat = settings.showRepeats - 1;
    status.toDisplayIndex = status.toDisplayIndex + 1;
    status.toDisplay[status.toDisplayIndex].displayMe (elem.rndNum);
    window.alert("displayNext " + getRepeatStatusString());
  }

  /** Manages the timeouts to show and hide the numbers or images. */
  function blink ()
  {
    elem.rndNum.style.visibility = "hidden";

    var t1 = setTimeout(showNumberOn, settings.hideMs);
    var t2Time = settings.hideMs + settings.showMs;
    if (status.curRepeat > 0)
    {
      //window.alert("blink " + getRepeatStatusString() + ": same image, set BDB.blink timeout to " + (t2Time));
      status.curRepeat = status.curRepeat - 1;
      var t2 = setTimeout(blink, t2Time);
    }
    else if (status.toDisplayIndex < settings.amount)
    {
      // status.curRepeat == 0 ==> switch to next image
      // status.toDisplayIndex < settings.amount ==> there is a next image
      //window.alert("blink " +  + getRepeatStatusString() + ": next image! call displayNext");
      displayNext ()
      var t2 = setTimeout(blink, t2Time);
    }
    else {
      // this was the last repeat of the last image, only hide it
      //window.alert("blink "  + getRepeatStatusString() + ": last repeat of last image! set showNumberOff timeout to " + t2Time);
      var t2 = setTimeout(showNumberOff, t2Time);
    }

  }

  function showNumberOn ()
  {
    //window.alert("showNumberOn wurde aufgerufen");
    elem.rndNum.style.visibility = "visible";
  }

  function showNumberOff ()
  {
    //window.alert("showNumberOff wurde aufgerufen");
    elem.rndNum.style.visibility = "hidden";

    if (showRepeats == 0 && amount == 0)
    {
      // finished -> enable solution button
      elem.btnSolve.removeAttribute('disabled');
    }
  }

  function getRepeatStatusString () {
    return "image: " + status.toDisplayIndex + "/" + settings.amount
      + ", rep: " + status.curRepeat + "/" + settings.showRepeats;
  }

  // Direkt das Object mit der öffentlichen Schnittstelle zurückgeben
  return {

    init: function ()
    {
      //window.alert("init wurde aufgerufen");
      elem.rndNum = document.getElementById("rndNum");
      elem.intro = document.getElementById("intro");
      elem.game = document.getElementById("game");
      elem.settings = document.getElementById("settings");

      elem.btnSolve = document.getElementById("solveGame");

      //document.getElementById("startGame").onclick = BDB.displayNumber();
      return null;
    },

    startGame: function ()
    {
      getValues ();

      //window.alert ("Settings: numberLength=" + settings.numberLength
      //  + ", amount=" + settings.amount + ", showRepeats=" + settings.showRepeats
      //  + ", showMs=" + settings.showMs + ", hideMs=" + settings.hideMs);

      // get data and init loops
      status.toDisplay = BDBdata.initData (settings.gameType, settings.amount, settings.numberLength);
      status.toDisplayIndex = -1;   // because we will call displayNext to start

      // switch screen and start displaying
      BDB.displayGameOnly ();
      elem.rndNum.style.display = "block";
      elem.btnSolve.setAttribute('disabled','disabled');

      window.alert ("before displayNext: " + getRepeatStatusString());
      displayNext ();
      window.alert ("before displayNext: " + getRepeatStatusString());
      blink ();
    },

    solveGame: function ()
    {
      // TODO display shown values

      BDB.displayGameOnly ();
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


  };
})();
// Ende des eingeklammerten Funktionsausdrucks, dahinter
// direkt () zum Aufruf der soeben definierten Funktion

//BDB.öffentlicheMethode1();

// Ergibt undefined, weil von außen nicht sichtbar:
//window.alert("Container.privateMethode von außerhalb: " + BDB.privateMethode);
