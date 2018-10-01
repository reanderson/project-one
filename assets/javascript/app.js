// VARIABLES
// All of these names can be changed later

// make reference variables for various locations on the page
var newEntryButton = $("#submitNewEntry") // submit new entry button in modal
var entryButtonsArea = $("#entryButtons") // column of entry buttons
var entryDisplayArea = $("#entryContent") // area where entry content is displayed

// make an array of objects to hold all the journal entries
var entries = []

if (!localStorage.getItem("userEntries")) {
  localStorage.setItem("userEntries", JSON.stringify(entries))
} else {
  entries = JSON.parse(localStorage.getItem("userEntries"))
}

console.log(localStorage.getItem("userEntries"))
console.log(JSON.stringify(entries))
console.log(JSON.parse(localStorage.getItem("userEntries")))
writeEntryButtons()

//variables used to track which entry is active and which item is being modified
var currentEntry = false;
var currentItem = false;

//variable used for other entry modifications, namely deletions
var entrySelect = false;

// =======================================================================================
// FUNCTIONS

function writeEntryButtons() {
  // empty the buttons area
  entryButtonsArea.empty()

  // using the entries array of objects, write buttons to the page for each entry.

  //loop over the entries array
  for (var i = 0; i < entries.length; i++) {
    // make a new container for the entry button and its delete button
    var btnDiv = $("<div>")
    btnDiv.addClass("btn-group btn-block")

    // create a new button
    var newButton = $("<button>");
    // class of entryBtn will be used for binding a click event
    newButton.addClass("btn btn-block entryBtn");

    // set button to have an attribute of what index of the entries array it refers to
    // that way we can get the object out of the entries array later
    newButton.attr("data-index", i)

    // Set the button's text to be the entry's title
    newButton.text(entries[i].title)

    // make the delete button
    var delBtn = $("<button>")
    delBtn.addClass("btn entryDelete")
    delBtn.html("<i class='fas fa-trash-alt'></i>")
    delBtn.attr("data-index", i)

    btnDiv.append(newButton, delBtn)
    entryButtonsArea.append(btnDiv)
  }

}

function getEntryContent(entry) {
  // argument is a journal entry object

  // empty the display area
  entryDisplayArea.empty();

  // make the title display
  var titleLine = $("<h3>")
  titleLine.text(entry.title)
  titleLine.addClass("entryTitle")

  entryDisplayArea.append(titleLine)

  // Go through the Content array
  for (var i = 0; i < entry.content.length; i++) {
    // check this content's type
    if (entry.content[i].type === "text") {
      // if it's text, then run the writeText function
      writeText(entry.content[i], i)
    } else if (entry.content[i].type === "divider") {
      // if a divider, just write a divider in
      var divider = $("<hr>")
      divider.addClass("contentDivider")
      divider.attr("data-index", i)
      entryDisplayArea.append(divider)
    }
  }

}

function deleteContent() {
  // This function will be called when a button to delete an item is clicked.
  // That means that currentItem should be set to the data-index value of a content item
  // and currentEntry is set to the data-index value of the currently active entry

  var entry = entries[currentEntry]

  // splice the content to be deleted from the entry's content
  entry.content.splice(currentItem, 1)

  // Save the removal locally
  localStorage.setItem("userEntries", JSON.stringify(entries))

  // rewrite the entry to the page, such that the deleted content should no longer exist
  getEntryContent(entry)
}


// The following functions are for writing different types of entry content:

function writeText(obj, index) {
  // takes a text content object and an index integer
  // writes that object as a div to the page

  // Prepare the new text for inputting to the page
  var newTextDisplay = $("<div>")

  // entryText class for later adding the ability to edit
  newTextDisplay.addClass("entryText my-2")

  // add text to div
  newTextDisplay.text(obj.content)

  // add a data-index attribute to be able to find where in the contents array this text item was later
  newTextDisplay.attr("data-index", index)

  // check for text color information
  if (obj.color) {
    newTextDisplay.addClass(obj.color)

    // newTextDisplay.attr("data-color", obj.color)
  }

  if (obj.align) {
    newTextDisplay.addClass("text-"+obj.align)
  }

  // append the div to the page
  entryDisplayArea.append(newTextDisplay)
}

// =======================================================================================
// BUTTONS
newEntryButton.on("click", function (event) {
  event.preventDefault()
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


$("#submitNewText").on("click", function () {
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

  if (!($("#colorSelect").val() === "Select Font Color")) {
    contentInfo.color = $("#colorSelect").val();
  }

  console.log($("#alignmentSelect").val())
  if (!($("#alignmentSelect").val() === "Select Text Alignment")) {
    contentInfo.align = $("#alignmentSelect").val()
  }

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
  $("#alignmentSelect").val("Select Text Alignment")
  $("#newTextModal").modal('hide')
})

$("#saveEdits").on("click", function () {
  var currentContent = entries[currentEntry].content[currentItem]
  console.log("Hmm")
  console.log(currentContent)

  if ($("#contentText").val().trim() === "") {
    // if there's no text, don't do anything
    return false;
  }
  currentContent.content = $("#contentText").val().trim()
  console.log(currentContent.content)
  if (!($("#colorChangeSelect").val() === "Select New Font Color")) {
    currentContent.color = $("#colorChangeSelect").val()
  }
  if (!($("#alignmentChangeSelect").val() === "Select Text Alignment")) {
    currentContent.align = $("#alignmentChangeSelect").val()
    }

  var entry = entries[currentEntry]
  getEntryContent(entry);

  localStorage.setItem("userEntries", JSON.stringify(entries))

  $("#colorChangeSelect").val("Select New Font Color") 
  $("#alignmentChangeSelect").val("Select Text Alignment")
  $("#editTextModal").modal('hide')
  currentItem = false
})


$("#callNewTextModal").on("click", function () {
  if (currentEntry === false) {
    // don't do anything if there isn't a current entry selected
    return false;
  }
  // Otherwise, bring up the modal
  $("#newTextModal").modal('show')
})


$(document).on("click", ".entryBtn", function () {
  console.log(this);
  currentEntry = $(this).attr("data-index");
  console.log(currentEntry)
  var entry = entries[currentEntry]
  getEntryContent(entry);
})

$(document).on("click", ".entryText", function () {
  $("#editTextModal").modal('show')
  console.log(this)
  currentItem = ($(this).attr("data-index"))

  $("#contentText").text($(this).text())
})

$(document).on("click", ".entryDelete", function () {
  console.log(this)
  $("#deleteEntryModal").modal('show')
  entrySelect = $(this).attr("data-index")
  $("#titleToDelete").text(entries[entrySelect].title)
})

$("#closeEditModal").on("click", function () {
  $("#editTextModal").modal('hide')
  currentItem = false
})

$(".deleteBtn").on("click", function () {
  deleteContent();
  $("#editTextModal").modal('hide')
  currentItem = false
})

$("#doNotDeleteEntry").on("click", function () {
  entrySelect = false;
  $("#deleteEntryModal").modal('hide')
})

$("#deleteEntry").on("click", function () {
  //remove the current entry from the entries array
  entries.splice(entrySelect, 1)

  //save the change to local storage
  localStorage.setItem("userEntries", JSON.stringify(entries))

  //rewrite entry buttons
  writeEntryButtons()

  if (entrySelect === currentEntry) {
    // if the entry to be deleted is also the entry being displayed,

    // empty out the display area,
    entryDisplayArea.empty()

    // and state that there is no current entry.
    currentEntry = false;
  }

  entrySelect = false;

  //close the modal
  $("#deleteEntryModal").modal('hide')
})

$("#newDivider").on("click", function () {
  //create a new object for the entry's contents array
  var dividerObj = {}
  dividerObj.type = "divider"

  // create the divider (<hr>) to add to the content
  var divider = $("<hr>")
  divider.attr("data-index", entries[currentEntry].content.length)
  divider.addClass("contentDivider")
  entryDisplayArea.append(divider)

  entries[currentEntry].content.push(dividerObj)
  localStorage.setItem("userEntries", JSON.stringify(entries))
})

$(document).on("click", ".contentDivider", function () {
  //open the delete modal
  $("#deleteDividerModal").modal('show')

  //set the current item to this item's data-index
  currentItem = $(this).attr("data-index")
})

$("#doNotDeleteItem").on("click", function () {
  $("#deleteDividerModal").modal('hide')

  currentItem = false;
})

$("#deleteItem").on("click", function () {
  deleteContent()

  $("#deleteDividerModal").modal('hide')

  currentItem = false;
})

$(document).on("click", ".entryTitle", function() {
  $("#editTitleModal").modal('show')

  $("#newTitleEntry").val($(this).text())
})

$("#submitNewTitle").on("click", function(event) {
  event.preventDefault()
  var newTitle = $("#newTitleEntry").val().trim()

  if (newTitle === "") {
    return false;
  }

  entries[currentEntry].title = newTitle

  writeEntryButtons()
  getEntryContent(entries[currentEntry])

  localStorage.setItem("userEntries", JSON.stringify(entries))
  $("#editTitleModal").modal('hide')
})