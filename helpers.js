function getResizeUrl(image, options) {
  if (
    (!image.filename || !image.source) ||
    (!options.width && !options.height)
  ) {
    return image
  }

  if (image.source === 'pexels') {
    let url = image.filename
    const params = []

    if (options.crop) {
      params.push(`fit=crop`);
    }

    if (options.width) {
      params.push(`w=${options.width}`);
    }

    if (options.height) {
      params.push(`h=${options.height}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return url
  }

  if (image.source === 'sitesgpt') {
    const inputString = image.filename
    const lastIndex = inputString.lastIndexOf('/')
    let path = inputString.substring(0, lastIndex)
    let filename = inputString.substring(lastIndex + 1)
    filename = encodeURIComponent(filename)

    const width = options.width ?? options.height
    const height = options.height ?? options.width

    if (!options.crop) {
      path += '/fit-in'
    }

    path += `/${width}x${height}`

    return `${path}/${filename}`
  }

  if (image.source === 'cloudinary' || image.source === 'stock') {
    const width = options.width ?? options.height
    const height = options.height ?? options.width
    const crop = image.crop ?? options.crop

    if (!width && !height) {
      return image.filename
    }

    const parts = image.filename.split('/upload/')
    let path = `${parts[0]}/upload/`
    const filename = parts[1]
    
    if (crop === 'crop' || crop === true) {
      path += 'c_fill'

      if (image.gravity) {
        path += `,g_${image.gravity}`
      } else {
        path += ',g_auto'
      }
    } else {
      path += 'c_limit'
    }

    if (width) {
      path += `,w_${width}`
    }

    if (height) {
      path += `,h_${height}`
    }

    return `${path}/${filename}`
  }

  return image.filename
}

function themeColors(theme) {
  const colors = {}

  switch(theme) {
    case 'dark':
      colors.background = 'bg-gray-900';
      colors.text = 'text-gray-100';
      colors.text_light = 'text-gray-300';
      break;
    case 'medium':
      colors.background = 'bg-gray-100';
      colors.text = 'text-gray-900';
      colors.text_light = 'text-gray-700';
      break;
    case 'brand-primary':
      colors.background = 'bg-brand-primary';
      colors.text = 'text-white';
      colors.text_light = 'text-gray-100';
      break;
    case 'brand-secondary':
      colors.background = 'bg-brand-secondary';
      colors.text = 'text-white';
      colors.text_light = 'text-gray-100';
      break;
    case 'brand-accent':
      colors.background = 'bg-brand-accent';
      colors.text = 'text-white';
      colors.text_light = 'text-gray-100';
      break;
    default:
      colors.background = 'bg-white';
      colors.text = 'text-gray-900';
      colors.text_light = 'text-gray-700';
  }

  return colors
}

function handleLinkClick(event) {
  // Ignore modified clicks (new tab, middle click, etc.)
  if (
    event.defaultPrevented ||
    event.button !== 0 || // Only left click
    event.metaKey || 
    event.ctrlKey || 
    event.shiftKey || 
    event.altKey
  ) {
    return;
  }

  const href = event.target.getAttribute('href');
  if (!href || href.startsWith('javascript:')) {
    return;
  }

  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(href, currentUrl);

  // Normalize paths to treat / and /index as the same
  const normalizePath = (path) => path === '/' || path === '/index' ? '/' : path;
  
  const normalizedCurrentPath = normalizePath(currentUrl.pathname);
  const normalizedTargetPath = normalizePath(targetUrl.pathname);

  const isSamePath = normalizedCurrentPath === normalizedTargetPath;
  const isHashOnly = isSamePath && targetUrl.hash;

  if (isHashOnly) {
    event.preventDefault();
    const targetEl = document.querySelector(targetUrl.hash);
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      history.pushState(null, '', targetUrl.hash);
    }
  } else if (currentUrl.href !== targetUrl.href) {
    event.preventDefault();
    window.location.href = targetUrl.href;
  }
}
