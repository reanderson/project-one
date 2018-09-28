// VARIABLES
// All of these names can be changed later

// make reference variables for various locations on the page
var newEntryButton = $("#submitNewEntry") // submit new entry button in modal
var entryButtonsArea = $("#entryButtons") // column of entry buttons
var entryDisplayArea = $("#entryContent") // area where entry content is displayed

// make an array of objects to hold all the journal entries
var entries = []

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

  // make the title display
  var titleLine = $("<h3>")
  titleLine.text(entry.title)
  titleLine.addClass("")

  entryDisplayArea.append(titleLine)

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

  // clear the title entry field, close the modal, and update the entry buttons
  $("#entry-title").val("")
  $("#newEntryModal").modal('hide')

  writeEntryButtons()
})

$(document).on("click", ".entryBtn", function() {
  console.log(this);
  entryDisplayArea.empty();
  var entry = entries[parseInt($(this).attr("data-index"))]
  getEntryContent(entry);
})

//========================================================================================
// PAGE CONTENT