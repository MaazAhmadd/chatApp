import helpers from "./helpers.js";
import randomwords from "./randomword.js";

let roomLink = "";

window.addEventListener("load", () => {
  //When the chat icon is clicked
  document.querySelectorAll(".toggle-chat-pane").forEach((el) => {
    el.addEventListener("click", (e) => {
      let chatElem = document.querySelector("#chat-pane");
      let mainSecElem = document.querySelector("#main-section");

      if (chatElem.classList.contains("chat-opened")) {
        chatElem.setAttribute("hidden", true);
        mainSecElem.classList.remove("col-md-9");
        mainSecElem.classList.add("col-md-12");
        chatElem.classList.remove("chat-opened");
      } else {
        chatElem.attributes.removeNamedItem("hidden");
        mainSecElem.classList.remove("col-md-12");
        mainSecElem.classList.add("col-md-9");
        chatElem.classList.add("chat-opened");
      }

      //remove the 'New' badge on chat icon (if any) once chat is opened.
      setTimeout(() => {
        if (
          document.querySelector("#chat-pane").classList.contains("chat-opened")
        ) {
          helpers.toggleChatNotificationBadge();
        }
      }, 300);
    });
  });

  //When the video frame is clicked. This will enable picture-in-picture
  document.getElementById("local").addEventListener("click", () => {
    if (!document.pictureInPictureElement) {
      document
        .getElementById("local")
        .requestPictureInPicture()
        .catch((error) => {
          // Video failed to enter Picture-in-Picture mode.
          console.error(error);
        });
    } else {
      document.exitPictureInPicture().catch((error) => {
        // Video failed to leave Picture-in-Picture mode.
        console.error(error);
      });
    }
  });
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response;
  }

  //When the 'Create room" is button is clicked
  document.getElementById("create-room").addEventListener("click", (e) => {
    e.preventDefault();

    let roomName = randomwords(2).join(" ");
    let yourName = document.querySelector("#your-name").value;

    //create room link
    roomLink = `${location.origin}?room=${roomName
      .trim()
      .replaceAll(" ", "_")}_${helpers.generateRandomString()}`;

    if (roomName && yourName) {
      //remove error message, if any
      document.querySelector("#err-msg").innerHTML = "";

      //save the user's name in sessionStorage
      sessionStorage.setItem("username", yourName);

      //show message with link to room

      document.body.classList.add("showLoginForm");
      document.getElementById("roomLink").value = roomLink;
      document.querySelector(".animated-btn").href = roomLink;
      document
        .getElementById("room-link-share-creation")
        .addEventListener("click", (e) => {
          e.preventDefault();
          let dummy = document.createElement("input");
          let text = roomLink;
          document.body.appendChild(dummy);
          dummy.value = text;
          dummy.select();
          document.execCommand("copy");
          document.body.removeChild(dummy);
          let x = document.getElementById("snackbar");
          x.className = "show";
          setTimeout(function () {
            x.className = x.className.replace("show", "");
          }, 3000);
        });

      document
        .querySelector("#close-the-popup")
        .addEventListener("click", () => {
          document.body.classList.remove("showLoginForm");
        });

      //empty the values
      document.querySelector("#your-name").value = "";
    } else {
      document.querySelector("#err-msg").innerHTML = "All fields are required";
    }
  });

  //When the 'Enter room' button is clicked.
  document.getElementById("enter-room").addEventListener("click", (e) => {
    e.preventDefault();

    let name = document.querySelector("#username").value;

    if (name) {
      //remove error message, if any
      document.querySelector("#err-msg-username").innerHTML = "";

      //save the user's name in sessionStorage
      sessionStorage.setItem("username", name);

      //reload room
      location.reload();
    } else {
      document.querySelector("#err-msg-username").innerHTML =
        "Please input your name";
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("expand-remote-video")) {
      helpers.maximiseStream(e);
    } else if (e.target && e.target.classList.contains("mute-remote-mic")) {
      helpers.singleStreamToggleMute(e);
    }
  });

  document.getElementById("closeModal").addEventListener("click", () => {
    helpers.toggleModal("recording-options-modal", false);
  });
});
