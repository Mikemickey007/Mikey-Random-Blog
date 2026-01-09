const API = "http://localhost:3000";

async function fetchPosts() {
    const res = await fetch(`${API}/posts`);
    if (!res.ok) throw new Error("Posts failed");
    return res.json();
}

async function fetchUser() {
    const res = await fetch(`${API}/users`);
    return res.json();
}

async function fetchCommentsByPost(postId) {
    const res = await fetch(`${API}/comments?postId=${postId}`);
    return res.json();
}

async function postComment(comment) {
    const res = await fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment)
    });

    if (!res.ok) throw new Error("Post failed");

    return res.json();
}

