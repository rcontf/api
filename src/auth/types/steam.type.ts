export namespace ISteam {
	export interface Profile {
	  provider: 'steam';
	  _json: {
		steamid: string;
		communityvisibilitystate: number;
		profilestate: number;
		personaname: string;
		profileurl: string;
		avatar: string;
		avatarmedium: string;
		avatarfull: string;
		lastlogoff: number;
		personastate: number;
		primaryclanid: string;
		timecreated: number;
		personastateflags: number;
	  };
	  id: string;
	  displayName: string;
	  photos: Record<'value', string>[];
	}
  }