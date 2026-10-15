// Plays the FaveUp film inside a phone mockup. The idle lock screen stays underneath the
// <video>; when the film ends (or is closed) the phone returns to it.
// Buttons with data-play="<phone id>" act as external play/pause controls and mirror the state.

const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function setupPlayer(phone) {
  const video = phone.querySelector('video');
  const hit = phone.querySelector('.phone__hit');
  const progress = phone.querySelector('.phone__progress');
  const triggers = [...document.querySelectorAll(`[data-play="${phone.id}"]`)];

  const setState = (state) => {
    phone.dataset.state = state;
    for (const trigger of triggers) trigger.dataset.state = state;
  };

  const setBuffering = (on) => phone.toggleAttribute('data-buffering', on);

  const play = () => {
    setBuffering(video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);
    video.play().catch((error) => {
      // A rejected play() (e.g. data saver) leaves the lock screen as it was.
      console.error('FaveUp film could not start', error);
      setBuffering(false);
      setState('idle');
    });
  };

  const reset = () => {
    video.pause();
    video.currentTime = 0;
    setBuffering(false);
    setState('idle');
    // Re-run the "notification arrives" animation so the story ends on the push.
    phone.removeAttribute('data-arrive');
    void phone.offsetWidth;
    phone.setAttribute('data-arrive', '');
  };

  const toggle = () => {
    if (phone.dataset.state === 'idle') {
      video.currentTime = 0;
      play();
    } else if (video.paused) {
      play();
    } else {
      video.pause();
    }
  };

  const updateTime = () => {
    const { currentTime, duration } = video;
    progress.style.setProperty('--p', duration ? currentTime / duration : 0);
    const text = `${formatTime(currentTime)} / ${formatTime(duration || 0)}`;
    for (const trigger of triggers) {
      for (const el of trigger.querySelectorAll('[data-time]')) el.textContent = text;
    }
  };

  video.addEventListener('playing', () => {
    setBuffering(false);
    setState('playing');
  });
  video.addEventListener('waiting', () => setBuffering(true));
  video.addEventListener('pause', () => {
    // "pause" also fires right before "ended"; the ended handler owns that case.
    if (!video.ended && phone.dataset.state !== 'idle') setState('paused');
  });
  video.addEventListener('ended', reset);
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('loadedmetadata', updateTime);
  video.addEventListener('volumechange', () => phone.toggleAttribute('data-muted', video.muted));

  hit.addEventListener('click', toggle);
  phone.querySelector('.phone__close').addEventListener('click', reset);
  phone.querySelector('.phone__mute').addEventListener('click', () => {
    video.muted = !video.muted;
  });
  for (const trigger of triggers) trigger.addEventListener('click', toggle);

  phone.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && phone.dataset.state !== 'idle') reset();
  });

  setState('idle');
  return {
    pause: () => {
      if (!video.paused) video.pause();
    },
  };
}
