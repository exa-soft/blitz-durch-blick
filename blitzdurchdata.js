var BDBdata  = (function () {
  // Definiere eine Funktion mit einem Funktionsausdruck,
  // durch runde Klammern umschlossen

  /* data types:
   * type 0: black numbers
   * type 1: numbers in color
   * type 2: images
   */


  /*--- data type for black numbers (type = 0) ---------------*/

  /*
   * Constructor for numbers for the display.
   */
  function DispDataNumberBlack (length)
  {
    this.len = length;
    this.text = createRandomDigitString (length);
  }

  /*
   * Display the number inside the given HTML element
   */
  DispDataNumberBlack.prototype.displayMe = function (elem) {
    elem.innerHTML = this.text;
  };

  /*
   * Get HTML code for this element (to concatenate with more code before
   * inserting it into some HTML element)
   */
  DispDataNumberBlack.prototype.getHTML = function () {
    return this.text;
  };


  /*--- data type for colored numbers (type = 1) ---------------*/

  var colors = [ "red", "orange", "green", "blue", "magenta", "gray" ];

  /*
   * Constructor for numbers for the display.
   */
  function DispDataNumberColor (length)
  {
    this.len = length;
    this.text = createRandomDigitString (length);
    this.colors = [];
    for (var i = 0; i < length; i++) {
      this.colors[i] = createRandomColor ();
    }
  }

  /*
   * Display the number inside the given HTML element
   */
  DispDataNumberColor.prototype.displayMe = function (elem) {
    elem.innerHTML = this.getHTML ();
  };

  /*
   * Get HTML code for this element (to concatenate with more code before
   * inserting it into some HTML element)
   */
  DispDataNumberColor.prototype.getHTML = function () {
    var s = "";
    for (var i = 0; i < this.len; i++)
      s = s + '<span style="color:' + this.colors[i] + '">' + this.text[i] + '</span>';
    return s;
  };

  /*--- data type for images (type = 2) ---------------*/

  /*
   * Constructor for images for the display.
   */
  function DispDataImage (basePath, imgNameArray)
  {
    window.alert ('array size is ' + imgNameArray.length);
    var index = rndInt (0, imgNameArray.length - 1);
    this.path = basePath + '/' + imgNameArray[index];
    this.imgHtml = '<img src="' + path + img + '" alt = "">';
  }

  /*
   * Display the image inside the given HTML element
   */
  DispDataImage.prototype.displayMe = function (elem) {
    elem.innerHTML = this.imgHtml;
  };

  /*
   * Get HTML code for this element (to concatenate with more code before
   * inserting it into some HTML element)
   */
  DispDataImage.prototype.getHTML = function () {
    return this.imgHtml;
  };


  /*--- array to store the data to display (numbers or images) ---*/

  var dataForDisplay;

  function createDataObject (type, length)
  {
    switch (type) {
      case 2:   // images
        text = "not yet implemented";
        alert (text);
      break;
      case 1:   // numbers in color
        return new DispDataNumberColor (length);
      break;
      default:  // black numbers
        return new DispDataNumberBlack (length);
      break;
    }
    return null;
  }

  /* --- helper functions --- */

  function rndInt (min, max)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createRandomDigitString (length)
  {
    var s = "";
    for (var i = 0; i < length; i++)
    {
      s = s + (rndInt (0, 9)).toString();
    };
    return s;
  }

  function createRandomColor ()
  {
    // create a digit string (color is hex, but we want it a dark color,
    // so we do not need colors with a-f anyway)
    var index = rndInt (0, colors.length - 1);
    return colors[index];
  }

  /* *** public API **************/

  // Direkt das Object mit der öffentlichen Schnittstelle zurückgeben
  return {

    initData: function (type, amount, length)
    {
      //window.alert ("will create data for type " + type + ", amount " + amount + ", length " + length);
      dataForDisplay = [];
      for (var i = 0; i < amount; i++) {
        dataForDisplay[i] = createDataObject (type, length);
      }
      return dataForDisplay;
    },

    displayInElement: function (elem, dataObjArray)
    {
      if (dataObjArray.constructor === Array)
      {
        var s = "";
        for (var i = 0; i < dataObjArray.length; i++) {
          tmpString = dataObjArray[i].getHTML();
          //window.alert ("HTML for object is " + tmpString);
          s = s + tmpString + "<br />";
        }
        //window.alert ("HTML is: " + s);
        elem.innerHTML = s;
      }
      else
        elem.innerHTML = "ERROR: dataObjArray is not an array ('" + dataObjArray + "')";
    },

    /** return a position object (x, y) with Strings (like "50px") */
    getRandomPosition: function ()
    {
      var pos = {
        x: (rndInt (0, 300)).toString() + "px",
        y: (rndInt (0, 400)).toString() + "px"
      }
      return pos;
    },

  };
})();
// Ende des eingeklammerten Funktionsausdrucks, dahinter
// direkt () zum Aufruf der soeben definierten Funktion
