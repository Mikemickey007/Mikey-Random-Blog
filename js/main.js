document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.style.fontWeight = 'bold';
            link.style.fontStyle = 'italic';
        }

        link.addEventListener('mouseenter', () => {
            link.style.color = 'var(--color-accent)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.color = '';
        });
    });


    const backBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('hidden', window.scrollY <= 300);
        if (window.scrollY > 300) {
            backBtn.classList.remove('hidden');
            backBtn.style.position = 'fixed';
            backBtn.style.bottom = '2rem';
            backBtn.style.right = '2rem';
            backBtn.style.zIndex = '100';
        } else {
            backBtn.classList.add('hidden');
        }
    });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg && currentPath.includes('index.html')) {
        welcomeMsg.classList.remove('hidden');
        welcomeMsg.style.padding = '1rem';
        welcomeMsg.style.textAlign = 'center';
        welcomeMsg.style.background = 'var(--color-success)';
        welcomeMsg.style.color = 'white';
        welcomeMsg.style.borderRadius = 'var(--radius)';
        welcomeMsg.style.marginBottom = '1rem';

        setTimeout(() => {
            welcomeMsg.classList.add('hidden');
        }, 5000);
    }

    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            const confirmLogout = confirm("Are you sure you want to leave?");
            if (!confirmLogout) {
                e.preventDefault();
            }
        });
    }

    const loader = document.getElementById('loading');
    navLinks.forEach(link => {
        if (!currentPath.includes(link.getAttribute('href')) && link.id !== 'logout') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = link.href;

                loader.classList.remove('hidden');
                loader.style.position = 'fixed';
                loader.style.top = '50%';
                loader.style.left = '50%';
                loader.style.transform = 'translate(-50%, -50%)';
                loader.style.background = 'var(--color-surface)';
                loader.style.padding = '2rem';
                loader.style.boxShadow = '0 0 50px rgba(0,0,0,0.2)';
                loader.style.zIndex = '1000';

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 800);
            });
        }
    });
});

function savePreference(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function loadPreference(key) {
    return JSON.parse(localStorage.getItem(key));
}

window.onload = function () {
    const darkMode = loadPreference("darkMode");

    if (darkMode) {
        document.body.classList.add("dark");
        const toggle = document.getElementById("darkToggle");
        if (toggle) toggle.checked = true;
    }

    const toggle = document.getElementById("darkToggle");
    if (toggle) {
        toggle.addEventListener("change", function () {
            document.body.classList.toggle("dark");
            savePreference("darkMode", toggle.checked);
        });
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const fontButtons = document.querySelectorAll(".font-controls button");

    const savedSize = localStorage.getItem("userFontSize") || "medium";
    applyGlobalFontSize(savedSize);

    fontButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const size = btn.getAttribute("data-size");
            localStorage.setItem("userFontSize", size);
            applyGlobalFontSize(size);
        });
    });


    function applyGlobalFontSize(sizeLabel) {
        const sizes = {
            small: "14px",
            medium: "16px",
            large: "22px"
        };
        const fontSize = sizes[sizeLabel];

        document.body.style.fontSize = fontSize;

        const allTextElements = document.querySelectorAll(
            "p, article, h1, h2, h3, h4, h5, h6, a, input, button, label, li, span, textarea"
        );

        allTextElements.forEach(el => {
            el.style.fontSize = fontSize;
        });

        fontButtons.forEach(btn => {
            btn.style.opacity = btn.getAttribute("data-size") === sizeLabel ? "1" : "0.6";
            btn.style.fontWeight = btn.getAttribute("data-size") === sizeLabel ? "bold" : "normal";
        });
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    const postContainer = document.getElementById("post-container");
    if (!postContainer) return;


    try {
        const posts = await fetchPosts();


        postContainer.innerHTML = "";


        posts.forEach(post => {
            const article = document.createElement("article");


            article.innerHTML = `
  <small class="muted">${post.category}</small>
  <h3>${post.title}</h3>
  <p>${post.author}</p>
  <p>${post.date}</p>
  <p>${post.content}</p>

  <button class="secondary" data-id="${post.id}">View Comments</button>

  <div class="comments hidden" id="comments-${post.id}"></div>

  <form class="comment-form" data-post="${post.id}">
     <input required placeholder="Your name" class="comment-author">
     <input required placeholder="Write a comment..." class="comment-body">
     <button type="submit">Send</button>
     <small class="error hidden" style="color:red"></small>
  </form>
`;



            postContainer.appendChild(article);
        });


    } catch (err) {
        postContainer.innerHTML = "<p>Failed to load posts.</p>";
        console.error(err);
    }
});


document.addEventListener("click", async (e) => {
    if (!e.target.matches("button[data-id]")) return;
    const postId = e.target.dataset.id;
    const commentBox = document.getElementById(`comments-${postId}`);
    if (!commentBox.classList.contains("hidden")) {
        commentBox.classList.add("hidden");
        return;
    }
    const comments = await fetchCommentsByPost(postId);
    commentBox.innerHTML = "";
    if (comments.length === 0) {
        commentBox.innerHTML = "<p class='muted'>No comments yet.</p>";
    } else {
        comments.forEach(c => {
            const p = document.createElement("p");
            p.innerHTML = `<strong>${c.author}:</strong> ${c.body}`;
            commentBox.appendChild(p);
        });
    }
    commentBox.classList.remove("hidden");
});


document.addEventListener("DOMContentLoaded", async () => {
    const userInfo = document.getElementById("userInfo");
    if (!userInfo) return;
    const user = await fetchUser();
    userInfo.textContent = `👤 ${user.fullname} (@${user.username})`;
});



document.addEventListener("submit", async e => {
    if (!e.target.matches(".comment-form")) return;
    e.preventDefault();

    const form = e.target;
    const postId = form.dataset.post;
    const author = form.querySelector(".comment-author").value;
    const body = form.querySelector(".comment-body").value;
    const errorBox = form.querySelector(".error");

    const commentsBox = document.getElementById(`comments-${postId}`);

    const tempId = "temp-" + Date.now();

    const tempEl = document.createElement("p");
    tempEl.id = tempId;
    tempEl.innerHTML = `<strong>${author}:</strong> ${body} ⏳`;
    commentsBox.appendChild(tempEl);
    commentsBox.classList.remove("hidden");

    form.reset();
    errorBox.classList.add("hidden");

    try {
        const saved = await postComment({
            postId: Number(postId),
            author,
            body
        });

        tempEl.innerHTML = `<strong>${saved.author}:</strong> ${saved.body}`;

    } catch (err) {
        tempEl.remove();
        errorBox.textContent = "❌ Failed to send comment. Try again.";
        errorBox.classList.remove("hidden");
    }
});



