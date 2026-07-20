window.addEventListener('scroll', () => {
  const sectionTitles = document.querySelectorAll('.p-section__title');
  const windowHeight = window.innerHeight;

  // 最新情報
  const titleInfoCharacters = sectionTitles[0].querySelectorAll('span:not(:first-child)');
  let infoFirst = true;
  const titleInfoRectTop = sectionTitles[0].getBoundingClientRect().top;
  const titleInfoActiveHeight = titleInfoRectTop - windowHeight; 

  if (titleInfoActiveHeight <= -100 ) {
    if(!titleInfoCharacters[1].classList.contains("is-active__first-char")) {
      if(infoFirst === true) {
        infoFirst = false;
        titleInfoCharacters.forEach((character, index) => {
          setTimeout( () => {
            character.classList.add('is-active__first-char');
          }, 150 * index);
        });  
      }
    }
  }

  // 教科書取扱い店
  const titleWorkCharacters = sectionTitles[1].querySelectorAll('span:not(:first-child)');
  let workFirst = true;
  const titleWorkRectTop = sectionTitles[1].getBoundingClientRect().top;
  const titleWorkActiveHeight = titleWorkRectTop - windowHeight;

  if (titleWorkActiveHeight <= -100 ) {
    if(!titleWorkCharacters[1].classList.contains("is-active__first-char")) {
      if(workFirst === true) {
        workFirst = false;
        titleWorkCharacters.forEach((character, index) => {
          setTimeout( () => {
            character.classList.add('is-active__first-char');
          }, 150 * index);
        });  
      }
    }
  }

    // アクセスマップ
    const titleMapCharacters = sectionTitles[2].querySelectorAll('span:not(:first-child)');
    let mapFirst = true;
    const titleMapRectTop = sectionTitles[2].getBoundingClientRect().top;
    const titleMapActiveHeight = titleMapRectTop - windowHeight;

    if (titleMapActiveHeight <= -100 ) {
      if(!titleMapCharacters[2].classList.contains("is-active__first-char")) {
        if(mapFirst === true) {
          mapFirst = false;
          titleMapCharacters.forEach((character, index) => {
            setTimeout( () => {
              character.classList.add('is-active__first-char');
            }, 150 * index);
          });  
        }
      }
    }

    // map-text-walk
    const mapTextWalk = document.getElementById('map-text-walk');
    let firstMapTextWalkTrigger = true;
    const mapTextWalkRectTop = mapTextWalk.getBoundingClientRect().top;
    const mapTextWalkActiveHeight = mapTextWalkRectTop - windowHeight;
    if (mapTextWalkActiveHeight <= -120 ) {
      if(!mapTextWalk.classList.contains("active")) {
        if(firstMapTextWalkTrigger === true) {
          firstMapTextWalkTrigger = false;
          mapTextWalk.classList.add('active');
        }
      }
    }

    // map-text-place
    const mapTextPlace = document.getElementById('map-text-place');
    let firstMapTextPlaceTrigger = true;
    const mapTextPlaceRectTop = mapTextPlace.getBoundingClientRect().top;
    const mapTextPlaceActiveHeight = mapTextPlaceRectTop - windowHeight;
    if (mapTextPlaceActiveHeight <= -150 ) {
      if(!mapTextPlace.classList.contains("active")) {
        if(firstMapTextPlaceTrigger === true) {
          firstMapTextPlaceTrigger = false;
          mapTextPlace.classList.add('active');
        }
      }
    }
});