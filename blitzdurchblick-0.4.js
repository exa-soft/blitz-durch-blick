var BDB  = (function () {
  // Definiere eine Funktion mit einem Funktionsausdruck,
  // durch runde Klammern umschlossen

  var privateEigenschaft = "privat";

// TODO zusammenfassen in elem-Objekt (assoziatives Array)
  var elemRndNum;
  var elemIntro;
  var elemGame;
  var elemSettings;
  var elemBtnSolve;

// TODO zusammenfassen in Settings-Objekt (assoziatives Array)
  var gameType = 0;
  var numberLength = 3;
  var amount = 3;   // how many different numbers or images
  var showRepeats = 3;    // how many times show each number or image
  var showMs = 150;
  var hideMs = 750;
  // var text = "357";

// TODO zusammenfassen in toDisplay-Objekt (assoziatives Array)
  var toDisplay;
  var toDisplayIndex = 0;

  var curRepeat = showRepeats;

  function getValues ()
  {
    //window.alert("getValues wurde aufgerufen");

    // TODO parse value for game type (now only 0, hardcoded)
    gameType = 0;
    numberLength = parseInt(document.getElementById("numLen").value);

    amount = parseInt(document.getElementById("amount").value);
    showRepeats = parseInt(document.getElementById("repeat").value);
    showMs = parseInt(document.getElementById("showtime").value);
    hideMs = parseInt(document.getElementById("hidetime").value);

    //window.alert("getValues: amount=" + amount + ", showRepeats=" + showRepeats
    //  + ", show for " + showMs + "ms, hide for " + hideMs + "ms");

  }

  function displayNext ()
  {
    window.alert("displayNext wurde aufgerufen (index=" + toDisplayIndex + ")");
    curRepeat = showRepeats;
    toDisplay[toDisplayIndex].displayMe (elemRndNum);
    //elemRndNum.innerHTML = text;

    blink();
  }

  function blink ()
  {
    //window.alert("blink wurde aufgerufen, amount is " + amount + ", showRepeats is " + showRepeats);
    elemRndNum.style.visibility = "hidden";

    curRepeat = curRepeat - 1;
    var t1 = setTimeout(showNumberOn, hideMs);
    if (curRepeat > 0)
    {
      //window.alert("curRepeat=" + curRepeat + ", set BDB.blink timeout to " + (hideMs + showMs));
      var t2 = setTimeout(blink, hideMs + showMs);
    }
    else
    {
      // Wechsel zum nächsten Bild sofern curRepeat == 0
      toDisplayIndex = toDisplayIndex + 1;
      if (toDisplayIndex == amount)
      {
        // this was the last image, only hide it
        // TODO nur showNumberOff statt blink wenn auch amount auf 0 ist
        //window.alert("showRepeats=" + showRepeats + ", set showNumberOff timeout to " + (hideMs + showMs));
        var t2 = setTimeout(showNumberOff, hideMs + showMs);
      }
      else
      {
        // there are more images, switch to the next one
        // TODO nur showNumberOff statt blink wenn auch amount auf 0 ist
        //window.alert("showRepeats=" + showRepeats + ", set showNumberOff timeout to " + (hideMs + showMs));
        displayNext
        // var t2 = setTimeout(blink, hideMs + showMs);
      }

    }

  }

  function showNumberOn ()
  {
    //window.alert("showNumberOn wurde aufgerufen");
    elemRndNum.style.visibility = "visible";
  }

  function showNumberOff ()
  {
    //window.alert("showNumberOff wurde aufgerufen");
    elemRndNum.style.visibility = "hidden";

    if (showRepeats == 0 && amount == 0)
    {
      // finished -> enable solution button
      elemBtnSolve.removeAttribute('disabled');
    }
  }


  // Direkt das Object mit der öffentlichen Schnittstelle zurückgeben
  return {

    init : function ()
    {
      //window.alert("init wurde aufgerufen");

      elemRndNum = document.getElementById("rndNum");
      elemIntro = document.getElementById("intro");
      elemGame = document.getElementById("game");
      elemSettings = document.getElementById("settings");

      elemBtnSolve = document.getElementById("solveGame");

      //document.getElementById("startGame").onclick = BDB.displayNumber();
      return null;
    },

    startGame : function ()
    {
      getValues ();

      // get data and init loops
      toDisplay = BDBdata.initData (gameType, showRepeats, numberLength);
      toDisplayIndex = 0;

      // switch screen and start displaying
      BDB.displayGameOnly ();
      elemRndNum.style.display = "block";
      elemBtnSolve.setAttribute('disabled','disabled');

      displayNext ();
    },

    solveGame : function ()
    {
      // TODO display shown values

      BDB.displayGameOnly ();
    },

    displayIntroOnly : function ()
    {
      elemIntro.style.display = "block";
      elemSettings.style.display = "none";
      elemGame.style.display = "none";
    },

    displaySettingsOnly : function ()
    {
      elemIntro.style.display = "none";
      elemSettings.style.display = "block";
      elemGame.style.display = "none";
    },

    displayGameOnly : function ()
    {
      elemIntro.style.display = "none";
      elemSettings.style.display = "none";
      elemGame.style.display = "block";
    },


  };
})();
// Ende des eingeklammerten Funktionsausdrucks, dahinter
// direkt () zum Aufruf der soeben definierten Funktion

//BDB.öffentlicheMethode1();

// Ergibt undefined, weil von außen nicht sichtbar:
//window.alert("Container.privateMethode von außerhalb: " + BDB.privateMethode);
