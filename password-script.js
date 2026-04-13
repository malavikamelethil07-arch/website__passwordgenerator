// ============================================================
// password-script.js — All logic for the Password Generator
// ============================================================


// ---- Character sets used for password generation ----
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS   = '0123456789';
const SYMBOLS   = '!@#$%^&*()_+-=[]{}|;:,.<>?';


// ---- Update the length number shown next to the slider ----
function updateLength(value) {
  document.getElementById('length-display').textContent = value;
}


// ---- MAIN: Generate Password ----
function generatePassword() {
  // 1. Read user settings
  const length     = parseInt(document.getElementById('length-slider').value);
  const useUpper   = document.getElementById('opt-upper').checked;
  const useLower   = document.getElementById('opt-lower').checked;
  const useNumbers = document.getElementById('opt-numbers').checked;
  const useSymbols = document.getElementById('opt-symbols').checked;
  const keyword    = document.getElementById('keyword-input').value.trim();

  // 2. Make sure at least one option is checked
  if (!useUpper && !useLower && !useNumbers && !useSymbols) {
    alert('Please select at least one character type!');
    return;
  }

  // 3. Build the pool of allowed characters
  let pool = '';
  if (useUpper)   pool += UPPERCASE;
  if (useLower)   pool += LOWERCASE;
  if (useNumbers) pool += NUMBERS;
  if (useSymbols) pool += SYMBOLS;

  // 4. Generate a base random password from the pool
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    password += pool[randomIndex];
  }

  // 5. If the user typed a keyword, securely mix it in
  //    We do NOT just append it — we scatter its characters at random positions
  //    so it never appears as a recognizable word in the output.
  if (keyword.length > 0) {
    password = mixKeywordSecurely(password, keyword, pool);
  }

  // 6. Show the result
  document.getElementById('password-display').textContent = password;

  // 7. Update the strength indicator
  updateStrength(password);
}


// ---- Secure Keyword Mixing ----
// Instead of placing the keyword directly (which would be readable),
// we take each character of the keyword, combine it with a random
// character from the pool, then insert the result at a random position.
// This means the keyword's characters are scattered and interleaved
// with random data — it's unrecognizable in the final password.

function mixKeywordSecurely(password, keyword, pool) {
  // Convert password to an array so we can insert/replace at positions
  let chars = password.split('');

  for (let i = 0; i < keyword.length; i++) {
    // Pick a random position in the current password array
    const insertPos = Math.floor(Math.random() * chars.length);

    // Get the keyword character
    const kwChar = keyword[i];

    // Mix it: use the keyword char itself BUT shift it using a random pool char
    // This ensures the keyword char never sits alone and recognizable
    const randomPoolChar = pool[Math.floor(Math.random() * pool.length)];

    // Replace the character at that position with the keyword char
    // and insert a random char next to it (for extra scrambling)
    chars.splice(insertPos, 1, kwChar, randomPoolChar);
  }

  // Trim back to the desired length (mixing may have made it longer)
  const desiredLength = parseInt(document.getElementById('length-slider').value);

  // Shuffle the array one more time so keyword chars aren't grouped together
  chars = shuffleArray(chars);

  // Return as string, trimmed to desired length
  return chars.slice(0, desiredLength).join('');
}


// ---- Shuffle an array randomly (Fisher-Yates algorithm) ----
// This is the standard way to randomly reorder an array.
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap arr[i] and arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


// ---- Evaluate Password Strength ----
function updateStrength(password) {
  const bar  = document.getElementById('strength-bar');
  const text = document.getElementById('strength-text');

  let score = 0;

  // Award points based on different criteria
  if (password.length >= 8)  score++;
  if (password.length >= 14) score++;
  if (/[A-Z]/.test(password)) score++;   // has uppercase
  if (/[a-z]/.test(password)) score++;   // has lowercase
  if (/[0-9]/.test(password)) score++;   // has numbers
  if (/[^A-Za-z0-9]/.test(password)) score++; // has symbols

  // Map score to a label, color, and bar width
  if (score <= 2) {
    bar.style.width = '25%';
    bar.style.backgroundColor = '#ef4444';  // red
    text.textContent = 'Weak';
    text.style.color = '#ef4444';
  } else if (score <= 4) {
    bar.style.width = '60%';
    bar.style.backgroundColor = '#f59e0b';  // amber
    text.textContent = 'Medium';
    text.style.color = '#f59e0b';
  } else {
    bar.style.width = '100%';
    bar.style.backgroundColor = '#22c55e';  // green
    text.textContent = 'Strong';
    text.style.color = '#22c55e';
  }
}


// ---- Copy password to clipboard ----
function copyPassword() {
  const pw = document.getElementById('password-display').textContent;

  // Don't copy the placeholder text
  if (pw === 'Click Generate...') {
    alert('Generate a password first!');
    return;
  }

  // navigator.clipboard is the modern way to copy text
  navigator.clipboard.writeText(pw).then(function () {
    showToast();
  }).catch(function () {
    alert('Could not copy. Please copy manually.');
  });
}


// ---- Show the green "Copied!" toast notification ----
function showToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'block';

  // Hide it again after 2 seconds
  setTimeout(function () {
    toast.style.display = 'none';
  }, 2000);
}


// ---- Reset everything back to defaults ----
function resetAll() {
  document.getElementById('password-display').textContent = 'Click Generate...';
  document.getElementById('length-slider').value = 12;
  document.getElementById('length-display').textContent = 12;
  document.getElementById('opt-upper').checked   = true;
  document.getElementById('opt-lower').checked   = true;
  document.getElementById('opt-numbers').checked = true;
  document.getElementById('opt-symbols').checked = false;
  document.getElementById('keyword-input').value = '';

  // Reset strength bar
  const bar  = document.getElementById('strength-bar');
  const text = document.getElementById('strength-text');
  bar.style.width = '0%';
  text.textContent = '—';
  text.style.color = '';
}
function copyPassword() {
  const pw = document.getElementById('password-display').textContent;

  // Show inline error instead of alert
  if (pw === 'Click Generate...') {
    showError('Generate a password first!');
    return;
  }

  navigator.clipboard.writeText(pw).then(function () {
    showToast();
  }).catch(function () {
    showError('Could not copy. Please copy manually.');
  });
}

// New function — shows red error text on the page
function showError(message) {
  const error = document.getElementById('error-msg');
  error.textContent = message;

  // Clear the message after 2 seconds
  setTimeout(function () {
    error.textContent = '';
  }, 2000);
}