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
    gameTypeNumBlack: null, // radio buttons for game type
    gameTypeNumColor: null,
    gameTypeImage: null,
    optForNum: null,
    optForImg: null,
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
    imgPath: "",
  }

  var status = {
    toDisplay: null,                  // will contain the objects (numbers/images) to display
    toDisplayIndex: -1,               // current image to display (count up)
    curRepeat: settings.showRepeats,   // countdown how many times to display
    imprOn: false,
  }

  /** Fills settings object with values from form */
  function getSettings ()
  {
    if (document.getElementById("typeNumColor").checked)
      settings.gameType = 1;
    else if (document.getElementById("typeImages").checked)
      settings.gameType = 2;
    else
      settings.gameType = 0;
    settings.numberLength = parseInt(document.getElementById("numLen").value);
    settings.amount = parseInt(document.getElementById("amount").value);
    settings.showRepeats = parseInt(document.getElementById("repeat").value);
    settings.showMs = parseInt(document.getElementById("showtime").value);
    settings.hideMs = parseInt(document.getElementById("hidetime").value);

    settings.objMove = document.getElementById("dispChangeLoc").checked;
    settings.repMove = document.getElementById("repeatChangeLoc").checked;

    settings.imgPath = document.getElementById("imgPath").value;
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

  // helper functions to attach an event (also works for older browsers like IE8)
  function addEvent (obj, type, fn) {
    if (obj.addEventListener)
      obj.addEventListener (type, fn, false);
    else if (obj.attachEvent)
      obj.attachEvent ('on' + type, fn);
  }

  // helper functions to remove an event (also works for older browsers like IE8)
  function removeEvent (obj, type, fn) {
    if (obj.removeEventListener)
      obj.removeEventListener (type, fn, false);
    else if (obj.detachEvent)
      obj.detachEvent ('on' + type, fn);
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

      elem.gameTypeNumBlack = document.getElementById("typeNumBlack");
      elem.gameTypeNumColor = document.getElementById("typeNumColor");
      elem.gameTypeImage = document.getElementById("typeImages");
      elem.optForNum = document.getElementById("optForNum");
      elem.optForImg = document.getElementById("optForImg");
      addEvent (elem.gameTypeNumBlack, 'click', BDB.displaySettingsForNumbers);
      addEvent (elem.gameTypeNumColor, 'click', BDB.displaySettingsForNumbers);
      addEvent (elem.gameTypeImage, 'click', BDB.displaySettingsForImages);

      status.imprOn = false;

      return null;
    },

    startGame: function ()
    {
      getSettings ();

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

    /** display settings for numbers, hide settings for images */
    displaySettingsForNumbers: function ()
    {
      elem.optForNum.style.display = 'block';
      elem.optForImg.style.display = 'none';
    },

    /** display settings for images, hide settings for numbers */
    displaySettingsForImages: function ()
    {
      elem.optForNum.style.display = 'none';
      elem.optForImg.style.display = 'block';
    },

  };
})();
// Ende des eingeklammerten Funktionsausdrucks, dahinter
// direkt () zum Aufruf der soeben definierten Funktion

//BDB.öffentlicheMethode1();

// Ergibt undefined, weil von außen nicht sichtbar:
//window.alert("Container.privateMethode von außerhalb: " + BDB.privateMethode);
