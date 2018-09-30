// VARIABLES
// All of these names can be changed later

// make reference variables for various locations on the page
var newEntryButton = $("#submitNewEntry") // submit new entry button in modal
var entryButtonsArea = $("#entryButtons") // column of entry buttons
var entryDisplayArea = $("#entryContent") // area where entry content is displayed

// make an array of objects to hold all the journal entries
var entries = []

if(!localStorage.getItem("userEntries")) {
  localStorage.setItem("userEntries", JSON.stringify(entries))
} else {
  entries = JSON.parse(localStorage.getItem("userEntries"))
}

console.log(localStorage.getItem("userEntries"))
console.log(JSON.stringify(entries))
console.log(JSON.parse(localStorage.getItem("userEntries")))
writeEntryButtons()

var currentEntry = false;
var currentItem = false;

// =======================================================================================
// FUNCTIONS

function writeEntryButtons() {
  // empty the buttons area
  entryButtonsArea.empty()

  // using the entries array of objects, write buttons to the page for each entry.

  //loop over the entries array
  for (var i = 0; i < entries.length; i++) {
    // create a new button
    var newButton = $("<button>");
    // class of entryBtn will be used for binding a click event
    newButton.addClass("btn btn-block entryBtn");

    // set button to have an attribute of what index of the entries array it refers to
    // that way we can get the object out of the entries array later
    newButton.attr("data-index", i)

    // Set the button's text to be the entry's title
    newButton.text(entries[i].title)

    entryButtonsArea.append(newButton)
  }

}

function getEntryContent(entry) {
  // argument is a journal entry object

  // empty the display area
  entryDisplayArea.empty();

  // make the title display
  var titleLine = $("<h3>")
  titleLine.text(entry.title)
  titleLine.addClass("")

  entryDisplayArea.append(titleLine)

  // Go through the Content array
  for (var i = 0; i < entry.content.length; i++) {
    // check this content's type
    if(entry.content[i].type === "text") {
      // if it's text, then run the writeText function
      writeText(entry.content[i], i)
    }
  }

}


// The following functions are for writing different types of entry content:

function writeText(obj, index) {
  // takes a text content object and an index integer
  // writes that object as a div to the page

  // Prepare the new text for inputting to the page
  var newTextDisplay = $("<div>")

  // entryText class for later adding the ability to edit
  newTextDisplay.addClass("entryText")

  // add text to div
  newTextDisplay.text(obj.content)

  // add a data-index attribute to be able to find where in the contents array this text item was later
  newTextDisplay.attr("data-index", index)

  // check for text color information
  if(obj.color) {
    newTextDisplay.addClass(obj.color)

    newTextDisplay.attr("data-color", obj.color)
  }

  // append the div to the page
  entryDisplayArea.append(newTextDisplay)
}

// =======================================================================================
// BUTTONS
newEntryButton.on("click", function() {
  var title = $("#entry-title").val().trim()

  // check if a title has been entered
  if (title === "") {
    return false
  }

  // make a new object for this entry, with the entered title as the entry's title, 
  // and an empty array for the content
  var newEntry = {
    title: title,
    // probably include the date in here too
    content: []
  }

  // add the new entry to the entries array
  entries.push(newEntry)
  localStorage.setItem("userEntries", JSON.stringify(entries))
  console.log(localStorage.getItem("userEntries"))

  // clear the title entry field, close the modal, and update the entry buttons
  $("#entry-title").val("")
  $("#newEntryModal").modal('hide')

  writeEntryButtons()
})


$("#submitNewText").on("click", function() {
  var textInput = $("#newTextContent").val().trim();

  if (textInput === "") {
    // if there's no text, don't do anything
    return false;
  }

  // make a new empty object to contain this content item's data
  var contentInfo = {}

  // set key-value pairs for this content
  contentInfo.type = "text";
  contentInfo.content = textInput;

  if($("#colorSelect").val()) {
  contentInfo.color = $("#colorSelect").val();
  }
  // contentInfo.font = "";

  writeText(contentInfo, entries[currentEntry].content.length)
    
  // Add the object to the current entry's content array
  entries[currentEntry].content.push(contentInfo)
  console.log(entries)
  console.log(JSON.stringify(entries))
  localStorage.setItem("userEntries", JSON.stringify(entries))


  console.log(textInput)

  // reset entry fields, close the modal
  $("#newTextContent").val("")
  $("#colorSelect").val("Select Font Color")
  $("#newTextModal").modal('hide')
}) 

$("#saveEdits").on("click", function() {
  var currentContent = entries[currentEntry].content[currentItem]
  console.log("Hmm")
  console.log(currentContent)

  if ($("#contentText").val().trim() === "") {
    // if there's no text, don't do anything
    return false;
  }
  currentContent.content = $("#contentText").val().trim()
  console.log(currentContent.content)
  currentContent.color = $("#colorChangeSelect").val()

  var entry = entries[currentEntry]
  getEntryContent(entry);

  localStorage.setItem("userEntries", JSON.stringify(entries))
  
  $("#editTextModal").modal('hide')
  currentItem = false
})


$("#callNewTextModal").on("click", function() {
  if (currentEntry === false) {
    // don't do anything if there isn't a current entry selected
    return false;
  }
  // Otherwise, bring up the modal
  $("#newTextModal").modal('show')
})


$(document).on("click", ".entryBtn", function() {
  console.log(this);
  currentEntry = parseInt($(this).attr("data-index"));
  console.log(currentEntry)
  var entry = entries[currentEntry]
  getEntryContent(entry);
})

$(document).on("click", ".entryText", function() {
  $("#editTextModal").modal('show')
  console.log(this)
  currentItem = ($(this).attr("data-index"))

  $("#contentText").text($(this).text())

 
  

})

$("#closeEditModal").on("click", function(){
  $("#editTextModal").modal('hide')
  currentItem = false
})