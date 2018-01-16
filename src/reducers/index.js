import { SETUP_INSTANCE, CLOSE_SELECT, OPEN_SELECT, SELECT_ITEM, FOCUS_ITEM, CLEAR_SELECT, FOCUS_SELECT, BLUR_SELECT, SCROLL_SELECT, SEARCH_OPTIONS, UNLOCK_MOUSE_FOCUS, REMOVE_ITEM, CLEAR_SEARCH, CHECK_FOR_SCROLL, SELECT_ALL } from 'actions';

const initialState = {
	settings: {
		className: '',
		placeHolderInside: true,
		placeholder: 'Please Select',
		arrow: true,
		multiple: false,
		disabled: false,
		customScrollbar: false,
		searchable: true,
		commaSeperated: false,
		singleLine: false,
		lifo: false,
		selectAllButton: false,
		checkBoxes: false
	},
	options: [],
	height: '150',
	isOpen: false,
	selected: [],
	selectedIndex: [],
	initialized: false,
	focused: false,
	focusedItem: null,
	focusedItemIndex: null,
	mouseEventLocked: false,
	checkForScroll: false,
	checkForHover: false,
	scrolled: {
		active: false,
		scroll: 0
	},
	search: {
		active: false,
		queryString: '',
		resultSet: []
	},
	onChange: () => {}
};

const reducer = ( state = initialState, action ) => {

    switch( action.type ) {

		case SELECT_ALL: {

			const options = state.search.active ? [ ... state.search.resultSet ] : [ ... state.options ];
			const keys = options.map( o => o.key );
			const indexes = state.search.active
				? [ ... state.options ].map( ( option, index ) => keys.includes( option.key ) ? index : null ).filter( x => x )
				: options.map( ( o, i ) => i );

			return Object.assign( {}, state, {
				selected: [ ... state.selected, ... keys ],
				selectedIndex: [ ... state.selectedIndex, ... indexes ],
				isOpen: state.settings.stayOpen
			} )

		}

		case REMOVE_ITEM: {
			return Object.assign( {}, state, {
				selected: [ ... state.selected ].filter( k => k !== state.options[ action.index ].key ),
				selectedIndex: [ ... state.selectedIndex ].filter( i => i !== action.index ),
				isOpen: true
			} )
		}

		case SETUP_INSTANCE: {

			return Object.assign( {}, state, {
				settings: Object.assign( {}, state.props, {
					className: action.props.className,
					placeHolderInside: action.props.placeHolderInside,
					placeholder: action.props.placeholder,
					arrow: action.props.arrow,
					multiple: action.props.multiple,
					disabled: action.props.disabled,
					customScrollbar: action.props.customScrollbar,
					searchable: action.props.searchable,
					stayOpen: action.props.multiple && action.props.stayOpen,
					commaSeperated: action.props.multiple && action.props.commaSeperated,
					singleLine: action.props.multiple && action.props.commaSeperated && action.props.singleLine,
					lifo: action.props.multiple && action.props.lifo,
					selectAllButton: action.props.multiple && action.props.selectAllButton,
					checkBoxes: action.props.multiple && action.props.checkBoxes
				} ),
				options: action.props.options,
				height: action.props.height,
				isOpen: action.props.isOpen,
				selected: action.selected,
				selectedIndex: action.selectedIndex,
				initialized: true,
				onChange: action.props.onChange,
				checkForScroll: action.props.isOpen
			} );
		}

		case SEARCH_OPTIONS: {

			const queryString = action.queryString.toLowerCase();
			return Object.assign( {}, state, {
				search: Object.assign( {}, state.search, {
					active: true,
					queryString: action.queryString,
					resultSet: state.options.filter( o =>
						o.label.toLowerCase().includes( queryString ) || o.key.toLowerCase().includes( queryString )
					)
				} ),
				isOpen: true,
				focusedItem: null,
				focusedItemIndex: null
			} )
		}

		case CHECK_FOR_SCROLL: {
			return Object.assign( {}, state, {
				checkForScroll: true
			} )
		}

		case CLEAR_SEARCH: {
			return Object.assign( {}, state, {
				search: initialState.search,
				focusedItem: null,
				focusedItemIndex: null
			} )
		}

		case CLOSE_SELECT: {
			return Object.assign( {}, state, {
				isOpen: false,
				focusedItem: null,
				focusedItemIndex: null,
				search: initialState.search
			} )
		}

		case OPEN_SELECT: {
			return Object.assign( {}, state, {
				isOpen: true,
				checkForScroll: true
			} )
		}

		case CLEAR_SELECT: {
			return Object.assign( {}, state, {
				selected: [],
				selectedIndex: [],
				focusedItem: null,
				focusedItemIndex: null,
				isOpen: action.stayOpen,
				search: action.stayOpen ? state.search : initialState.search
			} )
		}

		case FOCUS_SELECT: {
			return Object.assign( {}, state, {
				focused: true
			} )
		}

		case BLUR_SELECT: {
			return Object.assign( {}, state, {
				focused: false
			} )
		}

		case SELECT_ITEM: {

			return Object.assign( {}, state, {
				selected: state.settings.multiple
					? state.settings.lifo
						? [ ... [ action.item.key ], ... state.selected ]
						: [ ... state.selected, ... [ action.item.key ] ]
					: [ action.item.key ],
				selectedIndex: state.settings.multiple
					? state.settings.lifo
						? [ ... [ action.index ], ... state.selectedIndex ]
						: [ ... state.selectedIndex, ... [ action.index ] ]
					: [ action.index ],
				focusedItem: state.settings.stayOpen ? state.focusedItem : null,
				focusedItemIndex: state.settings.stayOpen ? state.focusedItemIndex : null,
				isOpen: state.settings.stayOpen,
				mouseEventLocked: state.settings.stayOpen,
				checkForHover: state.settings.stayOpen && ! action.isKeyboard,
				search: state.settings.stayOpen && state.settings.searchable
					? state.search
					: initialState.search
			} )
		}

		case FOCUS_ITEM: {

			return Object.assign( {}, state, {
				focusedItem: action.item.key,
				focusedItemIndex: action.index,
				mouseEventLocked: ! action.mouseEvent,
				checkForScroll: ! action.mouseEvent,
				checkForHover: false
			} )
		}

		case UNLOCK_MOUSE_FOCUS: {
			return Object.assign( {}, state, {
				mouseEventLocked: false,
				checkForScroll: false,
				checkForHover: false
			} )
		}

		case SCROLL_SELECT: {
			return Object.assign( {}, state, {
				checkForScroll: false,
				scrolled: Object.assign( {}, state.scrolled, {
					active: action.active,
					scroll: action.scroll
				} )
			} )
		}

		default: {
			return state;
		}

	}

}

export default reducer;