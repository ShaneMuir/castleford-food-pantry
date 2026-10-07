/**
 * Hero video progressive enhancement (Req 4.5-4.7, 12.8, 14.5).
 * The hero is a core/video block with a poster. The poster is always visible.
 * The muted video only plays when motion is allowed, the screen is not a phone,
 * and playback starts within 5 seconds. Otherwise the source is removed so the
 * poster stays and no video data is downloaded.
 */
( function () {
	var video = document.querySelector( '.cfp-hero video' );
	if ( ! video ) {
		return;
	}
	var frame = video.closest( '.cfp-hero__frame' ) || video.parentNode;
	var fallback = function () {
		frame.classList.add( 'is-poster-only' );
		video.pause();
		video.removeAttribute( 'src' );
		while ( video.firstChild ) {
			video.removeChild( video.firstChild );
		}
		video.load();
	};
	var reduce = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	var small = window.matchMedia && window.matchMedia( '(max-width: 782px)' ).matches;
	if ( reduce || small ) {
		fallback();
		return;
	}
	var timer = window.setTimeout( fallback, 5000 );
	video.addEventListener( 'playing', function () {
		window.clearTimeout( timer );
		frame.classList.add( 'is-playing' );
	} );
	video.addEventListener( 'error', fallback );
	video.addEventListener( 'stalled', function () {
		if ( ! frame.classList.contains( 'is-playing' ) ) {
			fallback();
		}
	} );
	var p = video.play();
	if ( p && p.catch ) {
		p.catch( fallback );
	}
}() );
