/**
 * Hero video progressive enhancement (Req 4.5-4.7, 12.8, 14.5).
 * The poster is always rendered. The muted video only plays when motion is
 * allowed and it starts within 5 seconds; otherwise it is removed and the
 * poster stays with the layout untouched.
 */
( function () {
	var hero = document.querySelector( '[data-cfp-hero-video]' );
	if ( ! hero ) {
		return;
	}
	var video = hero.querySelector( 'video' );
	if ( ! video ) {
		return;
	}
	var fallback = function () {
		hero.classList.add( 'is-poster-only' );
		video.pause();
		video.removeAttribute( 'src' );
		while ( video.firstChild ) {
			video.removeChild( video.firstChild );
		}
		video.load();
		video.hidden = true;
	};
	var reduce = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	if ( reduce ) {
		fallback();
		return;
	}
	var timer = window.setTimeout( fallback, 5000 );
	video.addEventListener( 'playing', function () {
		window.clearTimeout( timer );
		hero.classList.add( 'is-playing' );
	} );
	video.addEventListener( 'error', fallback );
	video.addEventListener( 'stalled', function () {
		if ( ! hero.classList.contains( 'is-playing' ) ) {
			fallback();
		}
	} );
	var p = video.play();
	if ( p && p.catch ) {
		p.catch( fallback );
	}
}() );
