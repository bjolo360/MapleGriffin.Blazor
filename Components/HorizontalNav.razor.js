export function initialize(container, instance) {

    var firstChild = document.querySelector('.c-card')

    if (firstChild != null) {
        container.scrollLeft = firstChild.offsetWidth;
    }

    container.isScrolling = false;
    container.currentIndex = 0;

    container.onscroll = async () => {

        var firstChild = document.querySelector('.c-card');
        var width = firstChild.offsetWidth;
        let middle = container.offsetWidth / 2;
        var idx = Math.floor((container.scrollLeft + middle) / firstChild.offsetWidth);

        if (idx != container.currentIndex) {
            container.currentIndex = idx;
            await instance.invokeMethodAsync("IndexChanged", idx);
        }

        if (!container.isScrolling) {
            let end = container.scrollWidth - container.offsetWidth;
            if (Math.ceil(container.scrollLeft) >= end) {
                await instance.invokeMethodAsync("OnScrollRight");
            }
            else if (container.scrollLeft === 0) {
                await instance.invokeMethodAsync("OnScrollLeft");
            }
        }

        container.isScrolling = false;
    }

    return {
        onNewItemsLeft: () => {
            if (!container.isScrolling) {
                container.isScrolling = true;
                container.scrollLeft += container.childNodes[0].scrollWidth;
            }
        },
        onNewItemsRight: () => {
            if (!container.isScrolling) {
                container.isScrolling = true;
                container.scrollLeft -= container.lastChild.scrollWidth;
            }
        },
    };
}