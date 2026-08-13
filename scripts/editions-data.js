window.discDeliveryData = {
	featuredEditionId: "edition-004",
	productEditions: {
		standard: {
			key: "standard",
			label: "Standard Edition",
			title: "Discover your next favorite artist.",
			description: "The Standard Edition delivers this month's featured artist on signed CD, plus a collectible card tied to the exact Disc Delivery edition.",
			gallerySlides: [
				{ label: "Standard Edition Box", caption: "Standard Edition monthly box" },
				{ label: "Signed CD", caption: "Signed CD from this month's featured artist" },
				{ label: "Collectible Artist Card", caption: "Collectible card with artist + edition number" },
				{ label: "Standard Edition Contents", caption: "Complete Standard Edition layout" }
			],
			includedItems: [
				{
					title: "A signed CD",
					photoLabel: "Signed CD",
					description: "A physical CD of this month's featured album, signed by the artist."
				},
				{
					title: "A collectible artist card",
					photoLabel: "Artist Card",
					description: "A collectible card featuring this month's featured artist and the Disc Delivery edition number."
				}
			],
			membershipPlans: [
				{
					id: "standard-monthly",
					label: "Monthly",
					price: "€29.99",
					subprice: "per month",
					description: "A flexible way to discover one new artist every month.",
					saving: "",
					checkoutUrl: "checkout.html?edition=standard&plan=monthly"
				},
				{
					id: "standard-three-month",
					label: "3 Month Plan",
					price: "€84.99",
					subprice: "€28.33 per month",
					description: "Three curated deliveries prepaid at a lighter monthly rate.",
					saving: "Save 5%",
					checkoutUrl: "checkout.html?edition=standard&plan=three-month"
				},
				{
					id: "standard-six-month",
					label: "6 Month Plan",
					price: "€159.99",
					subprice: "€26.67 per month",
					description: "A half-year of independent music discovery, prepaid.",
					saving: "Save 11%",
					checkoutUrl: "checkout.html?edition=standard&plan=six-month"
				},
				{
					id: "standard-twelve-month",
					label: "12 Month Plan",
					price: "€299.99",
					subprice: "€25.00 per month",
					description: "Our strongest annual value for consistent monthly discovery.",
					saving: "Save 17%",
					checkoutUrl: "checkout.html?edition=standard&plan=twelve-month"
				}
			]
		},
		club: {
			key: "club",
			label: "Club Edition",
			title: "MAKE MORE OF EVERY DELIVERY.",
			description: "Club Edition includes everything in Standard Edition and adds a custom physical art print created only for that month's Disc Delivery release.",
			gallerySlides: [
				{ label: "Club Edition Box", caption: "Club Edition monthly box" },
				{ label: "Signed CD", caption: "Signed CD from this month's featured artist" },
				{ label: "Collectible Artist Card", caption: "Collectible card with artist + edition number" },
				{ label: "Exclusive Art Print", caption: "Monthly Club Edition-only physical art print" }
			],
			includedItems: [
				{
					title: "Standard Edition",
					photoLabel: "Standard Edition",
					description: "Includes everything in Standard Edition: a signed CD and a collectible artist card."
				},
				{
					title: "An exclusive Disc Delivery Art print",
					photoLabel: "Art Print",
					description: "A custom-designed physical art print created exclusively for this month's Disc Delivery edition."
				}
			],
			membershipPlans: [
				{
					id: "club-monthly",
					label: "Monthly",
					price: "€39.99",
					subprice: "per month",
					description: "Includes the monthly signed CD, collectible card, and exclusive art print.",
					saving: "",
					checkoutUrl: "checkout.html?edition=club&plan=monthly"
				},
				{
					id: "club-three-month",
					label: "3 Month Plan",
					price: "€113.99",
					subprice: "€38.00 per month",
					description: "Three prepaid Club Editions with better monthly value.",
					saving: "Save 5%",
					checkoutUrl: "checkout.html?edition=club&plan=three-month"
				},
				{
					id: "club-six-month",
					label: "6 Month Plan",
					price: "€215.99",
					subprice: "€36.00 per month",
					description: "Six curated Club Editions delivered across half a year.",
					saving: "Save 10%",
					checkoutUrl: "checkout.html?edition=club&plan=six-month"
				},
				{
					id: "club-twelve-month",
					label: "12 Month Plan",
					price: "€419.99",
					subprice: "€35.00 per month",
					description: "The full-year Club Edition plan at the strongest monthly price.",
					saving: "Save 12%",
					checkoutUrl: "checkout.html?edition=club&plan=twelve-month"
				}
			]
		}
	},
	membershipPlans: [],
	editions: [
		{
			id: "edition-004",
			artistName: "Artist Placeholder 004",
			monthYear: "August 2026",
			editionCode: "Edition 004",
			albumTitle: "Album Placeholder 004",
			description: "Artist Placeholder 004 blends melodic experimentation with personal songwriting, balancing bold production with emotionally direct lyrics.",
			musicalIdentity: "Independent alternative artist with cinematic textures and understated vocals.",
			whySelected: "Selected for originality, strong identity, and a record that rewards repeat listens.",
			websiteUrl: "#",
			instagramUrl: "#",
			appleMusicUrl: "#",
			spotifyUrl: "#",
			portraitLabel: "Featured Artist Portrait",
			albumLabel: "Album Artwork",
			boxImages: ["Box Front", "Signed CD", "Insert Card"]
		},
		{
			id: "edition-003",
			artistName: "Artist Placeholder 003",
			monthYear: "July 2026",
			editionCode: "Edition 003",
			albumTitle: "Album Placeholder 003",
			description: "Edition 003 features a rhythm-forward artist pairing inventive arrangements with intimate storytelling.",
			musicalIdentity: "Indie artist with warm analog production and sharp hooks.",
			whySelected: "Chosen for distinct songwriting voice and lasting replay value.",
			websiteUrl: "#",
			instagramUrl: "#",
			appleMusicUrl: "#",
			spotifyUrl: "#",
			portraitLabel: "Artist Portrait 003",
			albumLabel: "Album Artwork 003",
			boxImages: ["Edition Box 003", "Signed CD 003", "Artist Card 003"]
		},
		{
			id: "edition-002",
			artistName: "Artist Placeholder 002",
			monthYear: "June 2026",
			editionCode: "Edition 002",
			albumTitle: "Album Placeholder 002",
			description: "Edition 002 highlights a genre-crossing artist focused on mood, detail, and careful sonic world-building.",
			musicalIdentity: "Independent artist merging electronic and acoustic elements.",
			whySelected: "Chosen for creative range and unmistakable artistic point of view.",
			websiteUrl: "#",
			instagramUrl: "#",
			appleMusicUrl: "#",
			spotifyUrl: "#",
			portraitLabel: "Artist Portrait 002",
			albumLabel: "Album Artwork 002",
			boxImages: ["Edition Box 002", "Signed CD 002", "Artist Card 002"]
		},
		{
			id: "edition-001",
			artistName: "Artist Placeholder 001",
			monthYear: "May 2026",
			editionCode: "Edition 001",
			albumTitle: "Album Placeholder 001",
			description: "Our first edition introduced a distinctive songwriter with direct lyrics and wide-open arrangements.",
			musicalIdentity: "Emerging independent artist with folk-inflected alternative sound.",
			whySelected: "Chosen for songwriting depth and a debut record with strong emotional pull.",
			websiteUrl: "#",
			instagramUrl: "#",
			appleMusicUrl: "#",
			spotifyUrl: "#",
			portraitLabel: "Artist Portrait 001",
			albumLabel: "Album Artwork 001",
			boxImages: ["Edition Box 001", "Signed CD 001", "Artist Card 001"]
		}
	]
};
