(function () {
  var root = document.querySelector('[data-blog]');
  if (!root) return;

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function dateLabel(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return esc(iso);
    return d.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function published(posts) {
    return (posts || []).filter(function (post) { return post && post.published !== false && post.slug; })
      .slice()
      .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  }

  function block(node) {
    if (!node || typeof node !== 'object') return '';
    if (node.h2) return '<h2 id="' + slugify(node.h2) + '">' + esc(node.h2) + '</h2>';
    if (node.p) return '<p>' + esc(node.p) + '</p>';
    if (node.ul && node.ul.length) {
      return '<ul>' + node.ul.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>';
    }
    return '';
  }

  function card(post, featured) {
    var href = '/blog/post.html?slug=' + encodeURIComponent(post.slug);
    var tags = (post.tags || []).map(function (tag) {
      return '<span class="blog-tag">' + esc(tag) + '</span>';
    }).join('');
    var image = post.image
      ? '<div class="blog-media' + (featured ? ' blog-media--feature' : '') + '"><img src="' + esc(post.image) + '" alt="' + esc(post.imageAlt || post.title) + '"></div>'
      : '';
    return '<a class="blog-card' + (featured ? ' blog-card--feature' : '') + '" href="' + href + '">' +
      image +
      '<div class="blog-card__body">' +
        '<p class="blog-card__meta"><span class="blog-badge">' + esc(post.topic || 'KLKT') + '</span><span>' + dateLabel(post.date) + '</span></p>' +
        '<h2>' + esc(post.title) + '</h2>' +
        '<p class="blog-card__excerpt">' + esc(post.excerpt || '') + '</p>' +
        (tags ? '<div class="blog-card__tags">' + tags + '</div>' : '') +
      '</div></a>';
  }

  function topics(posts) {
    var seen = {};
    var list = [];
    posts.forEach(function (post) {
      var topic = post.topic || 'KLKT';
      if (seen[topic]) return;
      seen[topic] = true;
      list.push(topic);
    });
    return list;
  }

  function topicLinks(posts, current) {
    var nav = document.querySelector('[data-blog-topics]');
    if (!nav) return;
    nav.innerHTML = topics(posts).map(function (topic) {
      return '<a class="blog-nav__topic' + (topic === current ? ' is-current' : '') + '" href="/blog.html?topic=' + encodeURIComponent(topic) + '">' + esc(topic) + '</a>';
    }).join('');
  }

  function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function readMinutes(post) {
    var words = [post.excerpt || ''];
    (post.body || []).forEach(function (node) {
      if (node.p) words.push(node.p);
      if (node.h2) words.push(node.h2);
      if (node.ul) words.push(node.ul.join(' '));
    });
    return Math.max(1, Math.round(words.join(' ').split(/\s+/).length / 200));
  }

  function renderIndex(posts) {
    var nav = document.querySelector('[data-blog-topics]');
    var requested = new URLSearchParams(location.search).get('topic');
    var active = requested && topics(posts).indexOf(requested) !== -1 ? requested : 'All';
    if (!posts.length) {
      root.innerHTML = '<p class="blog__status">No posts yet. Add one in content/blog.json.</p>';
      return;
    }
    function paint() {
      var shown = active === 'All' ? posts : posts.filter(function (post) { return post.topic === active; });
      if (!shown.length) {
        root.innerHTML = '<p class="blog__status">No posts in this topic yet.</p>';
        return;
      }
      var feature = shown[0];
      var rest = shown.slice(1);
      root.innerHTML =
        '<div class="blog-feature">' + card(feature, true) + '</div>' +
        (rest.length ? '<ul class="blog-grid">' + rest.map(function (post) {
          return '<li>' + card(post, false) + '</li>';
        }).join('') + '</ul>' : '');
    }
    if (nav) {
      nav.innerHTML = topics(posts).map(function (topic) {
        return '<button type="button" class="blog-nav__topic' + (topic === active ? ' is-current' : '') + '" data-topic="' + esc(topic) + '" aria-pressed="' + (topic === active) + '">' + esc(topic) + '</button>';
      }).join('');
      nav.addEventListener('click', function (event) {
        var button = event.target.closest('[data-topic]');
        if (!button) return;
        var topic = button.getAttribute('data-topic');
        active = active === topic ? 'All' : topic;
        nav.querySelectorAll('[data-topic]').forEach(function (item) {
          var on = item.getAttribute('data-topic') === active;
          item.classList.toggle('is-current', on);
          item.setAttribute('aria-pressed', String(on));
        });
        history.replaceState(null, '', active === 'All' ? '/blog.html' : '/blog.html?topic=' + encodeURIComponent(active));
        paint();
      });
    }
    paint();
  }

  function renderPost(posts) {
    var slug = new URLSearchParams(location.search).get('slug');
    var post = posts.filter(function (item) { return item.slug === slug; })[0];
    topicLinks(posts, post && post.topic);
    if (!post) {
      document.title = 'Post not found | KLKT';
      root.innerHTML = '<section class="post-hero"><h1>This post is not published.</h1><p class="post-hero__lead">Check the link, or set published to true in content/blog.json.</p><p class="post-hero__meta"><a href="/blog.html">All posts</a></p></section>';
      return;
    }
    document.title = post.title + ' | KLKT';
    var desc = document.querySelector('meta[name="description"]');
    if (desc && post.excerpt) desc.setAttribute('content', post.excerpt);

    var topic = post.topic || 'KLKT';
    var badges = '<a class="blog-badge" href="/blog.html?topic=' + encodeURIComponent(topic) + '">' + esc(topic) + '</a>' +
      (post.tags || []).map(function (tag) { return '<span class="blog-tag">' + esc(tag) + '</span>'; }).join('');

    var headings = (post.body || []).filter(function (node) { return node && node.h2; });
    var toc = headings.length ? '<nav class="post-toc" aria-label="Table of contents"><p class="post-side__title">Table of contents</p><ol>' +
      headings.map(function (node) {
        return '<li><a href="#' + slugify(node.h2) + '">' + esc(node.h2) + '</a></li>';
      }).join('') + '</ol></nav>' : '';

    var url = encodeURIComponent(location.href);
    var text = encodeURIComponent(post.title);
    var share = '<div class="post-share"><p class="post-side__title">Share this article</p><div class="post-share__row">' +
      '<a class="post-share__btn" href="https://twitter.com/intent/tweet?url=' + url + '&text=' + text + '" target="_blank" rel="noopener" aria-label="Share on X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.5l11.2 14.5Z"/></svg></a>' +
      '<a class="post-share__btn" href="https://www.linkedin.com/sharing/share-offsite/?url=' + url + '" target="_blank" rel="noopener" aria-label="Share on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4V9.75Z"/></svg></a>' +
      '<a class="post-share__btn" href="mailto:?subject=' + text + '&body=' + url + '" aria-label="Share by email"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-8 5.3-8-5.3ZM5.6 7 12 11.2 18.4 7H5.6Z"/></svg></a>' +
      '<button type="button" class="post-share__btn" data-copy-link aria-label="Copy link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0Zm-2.1 6.2a4.5 4.5 0 0 1-3.2-7.7l2.1-2.1a1 1 0 1 1 1.4 1.4l-2.1 2.1a2.5 2.5 0 0 0 3.5 3.5l2.1-2.1a1 1 0 1 1 1.4 1.4l-2.1 2.1a4.5 4.5 0 0 1-3.1 1.4Zm8-5.6a1 1 0 0 1-.7-1.7l2.1-2.1a2.5 2.5 0 0 0-3.5-3.5l-2.1 2.1a1 1 0 1 1-1.4-1.4L13 5.3a4.5 4.5 0 0 1 6.4 6.4l-2.1 2.1a1 1 0 0 1-.8.2Z"/></svg></button>' +
      '</div><p class="post-share__note" data-copy-note aria-live="polite"></p></div>';

    var cta = '<div class="post-cta"><p class="post-cta__title">Get paid for the work you already do.</p><p>Record real tasks on your phone and earn when the work is accepted.</p><a class="post-cta__btn" href="/#app-store">Get the app</a><a class="post-cta__link" href="/contributors.html">How contributing works</a></div>';

    var related = posts.filter(function (item) { return item.slug !== post.slug && item.topic === post.topic; })
      .concat(posts.filter(function (item) { return item.slug !== post.slug && item.topic !== post.topic; }))
      .slice(0, 3);

    root.innerHTML =
      '<section class="post-hero">' +
        '<div class="post-hero__badges">' + badges + '</div>' +
        '<h1>' + esc(post.title) + '</h1>' +
        (post.excerpt ? '<p class="post-hero__lead">' + esc(post.excerpt) + '</p>' : '') +
        '<p class="post-hero__meta"><span>' + esc(post.author || 'KLKT team') + '</span><span>' + dateLabel(post.date) + '</span><span>' + readMinutes(post) + ' min read</span></p>' +
      '</section>' +
      '<div class="post-layout">' +
        '<aside class="post-side">' + toc + cta + share + '</aside>' +
        '<article class="post-article">' +
          (post.image ? '<div class="post-cover"><img src="' + esc(post.image) + '" alt="' + esc(post.imageAlt || '') + '"></div>' : '') +
          '<div class="blog-post__body">' + (post.body || []).map(block).join('') + '</div>' +
        '</article>' +
      '</div>' +
      (related.length ? '<section class="post-related"><h2>Related articles</h2><ul class="blog-grid">' +
        related.map(function (item) { return '<li>' + card(item, false) + '</li>'; }).join('') + '</ul></section>' : '');

    var copy = root.querySelector('[data-copy-link]');
    if (copy) copy.addEventListener('click', function () {
      var note = root.querySelector('[data-copy-note]');
      var done = function () { if (note) note.textContent = 'Link copied'; };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () { if (note) note.textContent = location.href; });
      else if (note) note.textContent = location.href;
    });
  }

  fetch('/content/blog.json', { cache: 'no-cache' })
    .then(function (res) { if (!res.ok) throw new Error(String(res.status)); return res.json(); })
    .then(function (data) {
      var posts = published(data.posts);
      if (root.getAttribute('data-blog') === 'post') renderPost(posts);
      else renderIndex(posts);
    })
    .catch(function () {
      root.innerHTML = '<p class="blog__status">The posts could not be loaded. Open this page from the site, not as a file on disk.</p>';
    });
})();
