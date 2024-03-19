const feedDisplay = document.querySelector('#feed')

fetch('http://localhost:8000/results')
    .then(response => response.json())
    .then(data => {
        data.forEach(article => {
            const articleItem = `<div class='item'><h3>${article}</h3></div>`;
            feedDisplay.insertAdjacentHTML("beforeend", articleItem);
        });
        
        // Make ".item" elements draggable after they are created
        $(".item").draggable({
            revert: true, // Snap back to original position if not dropped on valid droppable
            start: function(event, ui) {
                $(this).addClass('dragging'); // Add class when dragging starts
            },
            stop: function(event, ui) {
                $(this).removeClass('dragging'); // Remove class when dragging stops
            }
        });
    })
    .catch(err => console.log(err));

// Make ".row" elements droppable
$(".box").droppable({
    accept: ".item", // Only accept ".item" elements
    drop: function(event, ui) {
        // If the droppable area already contains an item, reject the drop
        if ($(this).children('.item').length > 0) {
            return false;
        }
        // Append the draggable item to the droppable row
        $(this).append(ui.draggable); 
    }
});

// Make "#feed" droppable
$("#feed").droppable({
    accept: ".item", // Only accept ".item" elements
    drop: function(event, ui) {
        // When an item is dropped onto the feed
        $(this).append(ui.draggable); // Append the draggable item to the feed
    }
});
