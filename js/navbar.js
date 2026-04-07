/**
 * Navigation/Header management script
 * Updates navbar based on authentication status
 */

document.addEventListener('DOMContentLoaded', function() {
  updateNavigation();
});

function createAvatarElement(user, userName) {
  const avatarUrl = user && user.avatar ? user.avatar : '';
  const avatar = document.createElement('img');
  avatar.className = 'nav-user-avatar';
  avatar.alt = `${userName} profile picture`;
  avatar.referrerPolicy = 'no-referrer';

  if (avatarUrl) {
    avatar.src = avatarUrl;
    avatar.onerror = function() {
      this.style.display = 'none';
    };
  } else {
    avatar.style.display = 'none';
  }

  return avatar;
}

function setWelcomeLinkContent(linkEl, user, userName) {
  if (!linkEl) return;

  const avatar = createAvatarElement(user, userName);
  const text = document.createElement('span');
  text.textContent = `Welcome, ${userName.split(' ')[0]}`;

  linkEl.innerHTML = '';
  linkEl.classList.add('user-welcome-link');
  linkEl.appendChild(avatar);
  linkEl.appendChild(text);
}

function createSignOutLink(className) {
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = 'Sign Out';
  if (className) {
    link.className = className;
  }

  link.onclick = function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return link;
}

function appendUserNavigation(navContainer, user, userName, signOutClassName) {
  if (!navContainer || navContainer.querySelector('.user-welcome-link')) return;

  const welcomeLink = document.createElement('a');
  welcomeLink.href = '#';
  welcomeLink.style.pointerEvents = 'none';
  welcomeLink.style.cursor = 'default';
  setWelcomeLinkContent(welcomeLink, user, userName);

  navContainer.appendChild(welcomeLink);
  navContainer.appendChild(createSignOutLink(signOutClassName));
}

function updateNavigation() {
  const isLoggedIn = isAuthenticated();
  const navLinks = document.querySelector('.nav-links');
  const mobileNavLinks = document.querySelector('.mobile-sidebar');
  
  if (!navLinks) return;

  // Find and update Sign In/Sign Up links to Sign Out if authenticated
  if (isLoggedIn) {
    const user = getLoggedInUser();
    const userName = user ? (user.fullName || user.name || 'User') : 'User';
    
    // Update desktop navigation
    const signinLink = navLinks.querySelector('a[href="signin.html"]');
    const signupLink = navLinks.querySelector('a[href="sign.html"]');
    
    if (signinLink && signupLink) {
      // Replace Sign In and Sign Up with user info and Sign Out
      setWelcomeLinkContent(signinLink, user, userName);
      signinLink.href = '#';
      signinLink.style.pointerEvents = 'none';
      signinLink.style.cursor = 'default';
      
      signupLink.textContent = 'Sign Out';
      signupLink.href = '#';
      signupLink.onclick = createSignOutLink().onclick;
    } else {
      appendUserNavigation(navLinks, user, userName);
    }
    
    // Update mobile navigation
    if (mobileNavLinks) {
      const mobileSigninLink = mobileNavLinks.querySelector('a[href="signin.html"]');
      const mobileSignupLink = mobileNavLinks.querySelector('a[href="sign.html"]');
      
      if (mobileSigninLink && mobileSignupLink) {
        setWelcomeLinkContent(mobileSigninLink, user, userName);
        mobileSigninLink.href = '#';
        mobileSigninLink.style.pointerEvents = 'none';
        
        mobileSignupLink.textContent = 'Sign Out';
        mobileSignupLink.href = '#';
        mobileSignupLink.onclick = createSignOutLink().onclick;
      } else {
        appendUserNavigation(mobileNavLinks, user, userName);
      }
    }
  }
}
