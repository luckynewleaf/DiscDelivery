/*
 * DEPLOYMENT: edit this file directly, or use content-editor.html then Export
 * JSON and paste the exported values back into window.siteContent below.
 * Browser localStorage edits from the editor only affect that browser until
 * you copy them in here and redeploy.
 */
(function () {
	function placeholderTracklist(editionNumber) {
		const tracks = [];
		for (let i = 1; i <= 12; i += 1) {
			const index = String(i).padStart(2, "0");
			tracks.push({ song: "Track " + index, artist: "Artist " + editionNumber + "-" + index });
		}
		return tracks;
	}

	window.siteContent = {
		// ===== SHARED HEADER, FOOTER, NAVIGATION =====
		common: {
			brand: "Disc Delivery",
			nav: [
				{ label: "Archive", href: "archive.html" },
				{ label: "Past Editions", href: "past-editions.html" },
				{ label: "For Artists", href: "for-artists.html" },
				{ label: "Contact", href: "contact.html" }
			],
			accountUrl: "/account",
			footer: {
				legalLinks: [
					{ label: "Privacy Policy", href: "privacy-policy.html" },
					{ label: "Terms of Service", href: "terms-of-service.html" }
				],
				copyright: "© 2026 Disc Delivery"
			}
		},

		// ===== HOME PAGE =====
		home: {
			heroLines: ["Good Music.", "Delivered."],
			heroVideo: { src: "", poster: "" },
			heroImage: { src: "", alt: "Disc Delivery hero image" },
			heroCta: { label: "See the current edition", href: "subscribe.html" },
			howItWorksTitle: "How It Works",
			howItWorksIntro: "Disc Delivery is a recurring physical music club built around discovery, not algorithms.",
			howItWorksSteps: [
				{ title: "We Find the Freshest Artists", body: "Disc Delivery looks for independent, emerging, small, and under-the-radar artists making music worth discovering." },
				{ title: "We Curate the Edition", body: "Each edition contains 12 songs from 12 different artists. We carefully curate the songs and build a physical compilation around them: a digipak CD, custom cover artwork, a booklet featuring the 12 artists, and an additional art card with that month's cover artwork." },
				{ title: "We Deliver It", body: "The finished edition is delivered to the subscriber, so they can discover music they probably wouldn't have found through an algorithm or their usual listening habits." }
			],
			whyTitle: "Why Disc Delivery",
			whyStatement: "Music used to find you.",
			whyBody: [
				"You heard something in a coffee shop. You heard something in a TV show. You heard something on the radio. You stumbled across it while living your life — nothing recommended it to you.",
				"Disc Delivery isn't about calculated recommendations. It's about receiving 12 songs from 12 different artists and discovering something you didn't even know you wanted to hear."
			],
			archiveTitle: "From the Archive",
			archiveViewAll: "View Full Archive",
			archiveCount: 4
		},

		// ===== SUBSCRIBE (SUBSCRIPTION PRODUCT) PAGE =====
		subscribe: {
			eyebrow: "The Subscription",
			title: "Disc Delivery Club",
			shortDescription: "12 songs from 12 emerging artists, one song each, delivered as a single physical compilation on a recurring schedule.",
			image: { src: "", alt: "Current Disc Delivery edition" },
			gallery: [
				{ label: "Current Edition Box", image: "" },
				{ label: "Digipak CD", image: "" },
				{ label: "Artist Booklet", image: "" }
			],
			options: [
				{ id: "monthly", label: "Monthly", price: "€15", priceSuffix: "/ box", billingNote: "Billed every month.", planId: "monthly" },
				{ id: "quarterly", label: "Every 3 Months", price: "€40", priceSuffix: "/ 3 boxes", perBoxPrice: "€13.33 / box", savingsLabel: "Save €5", billingNote: "Billed every 3 months.", planId: "quarterly" }
			],
			subscribeButtonLabel: "Subscribe",
			billingPromptTitle: "How would you like to subscribe?",
			billingContinueLabel: "Continue to Checkout",
			includedTitle: "What you receive",
			includedItems: [
				{ bold: "Digipak CD", text: "with 12 songs from 12 different emerging artists, one song each, and custom cover artwork." },
				{ bold: "Artist Booklet", text: "with a page on each of the 12 artists featured in that edition." },
				{ bold: "Art Card", text: "featuring that month's cover artwork." }
			],
			detailsTitle: "Subscription details",
			details: [
				"A new edition is revealed roughly a week before each shipping deadline. The full artist and song list stays a mystery until your box arrives.",
				"Monthly: €15 per box + shipping, billed once per month. Cancel any time; cancellation takes effect at your next billing date.",
				"Every 3 Months: €40 per three boxes + shipping, billed once every three months. This is a commitment to the three boxes in that billing period — cancelling stops the next 3-month renewal, it does not cancel or refund the current commitment.",
				"There is no option to skip an individual month within an active plan."
			],
			shippingTitle: "Shipping",
			shipping: [
				"Shipping regions and rates are shown clearly at checkout.",
				"Boxes ship shortly after each subscription deadline closes."
			]
		},

		// ===== ARCHIVE (FULL EDITORIAL HISTORY, NOT FOR SALE) =====
		archive: {
			title: "Archive",
			intro: "Every Disc Delivery edition released to date. The Archive is editorial history, not a shop.",
			featuredSongsTitle: "Featured Songs"
		},

		// ===== SHOP / PAST EDITIONS (IN-STOCK PHYSICAL COPIES FOR SALE) =====
		shop: {
			title: "Past Editions",
			intro: "Past Disc Delivery editions, available to purchase while supplies last.",
			emptyState: "No past editions are currently in stock.",
			purchaseSurcharge: 5,
			addToCartLabel: "Add to Cart",
			outOfStockLabel: "Out of Stock",
			includedTitle: "What's included",
			shippingTitle: "Shipping",
			shipping: ["Shipping regions and rates are shown clearly at checkout."],
			backLink: { label: "View all past editions", href: "past-editions.html" }
		},

		// ===== FOR ARTISTS PAGE =====
		forArtists: {
			title: "For Artists",
			whoTitle: "Who are we looking for?",
			who: "Independent and emerging artists with strong identity, inventive music, and a real creative perspective — people we believe deserve wider audiences. They don't need to be unknown, just new-to-you. We do not feature artists who create AI-generated or AI-assisted music.",
			chosenTitle: "Who gets chosen?",
			chosen: "Twelve artists are selected for each edition, chosen for a clear creative identity and long-term collectability rather than trend momentum.",
			doTitle: "What do we do?",
			doText: "Selected artists are pressed onto that edition's 12-song compilation CD, given a page in the accompanying artist booklet, and introduced to Disc Delivery subscribers.",
			expectTitle: "What do we expect?",
			expectText: "One finished, mastered song ready for physical release, supporting artwork, and clear, responsive communication throughout that edition's production.",
			submitTitle: "How do I submit?",
			submitIntro: "Email us with your music, artwork, and a short introduction.",
			submitEmail: "apply@discdelivery.com"
		},

		// ===== CONTACT PAGE (INCLUDES FAQ BELOW CONTACT INFORMATION) =====
		contact: {
			title: "Contact",
			customerCare: "Customer Care: customercare@discdelivery.com",
			business: "Press & Business Inquiries: business@discdelivery.com",
			artistNote: "Looking to submit music? Visit the For Artists page.",
			artistNoteLink: { label: "For Artists", href: "for-artists.html" },
			faqTitle: "FAQ"
		},

		// ===== FAQ CONTENT (RENDERED ON THE CONTACT PAGE) =====
		faq: {
			title: "FAQ",
			categories: [
				{
					title: "Subscription",
					items: [
						["How does the Disc Delivery Club work?", "You subscribe, we reveal the 12 featured artists before the deadline, and we ship your mystery 12-song compilation after the window closes."],
						["What are the subscription options?", "Monthly, billed once a month, or Every 3 Months, billed once every 3 months for that period's three boxes."],
						["Can I skip a month?", "No. There is no option to skip an individual month within an active plan."],
						["Can I cancel my membership?", "Monthly plans can be cancelled anytime, effective at your next billing date. Every 3 Months plans cancel the next 3-month renewal; the current 3-month commitment is not cancelled or refunded."],
						["When are the artists revealed?", "About one week before the shipping deadline."],
						["When do I find out which artists and songs are included?", "The full artist and song list remains a mystery until your box arrives."]
					]
				},
				{
					title: "Shipping",
					items: [
						["When does my box ship?", "Shortly after the subscription deadline closes."],
						["Where do you ship?", "Shipping regions and rates are shown clearly at checkout."]
					]
				},
				{
					title: "Orders & Past Editions",
					items: [
						["What is the difference between the Archive and Past Editions?", "The Archive is our full editorial history of past compilations and is not for sale. Past Editions are in-stock physical copies you can purchase."],
						["How do I buy a past edition?", "Browse in-stock editions on the Past Editions page and add one to your cart."],
						["What if I already own an edition?", "Contact us and we'll try to help with an alternative when available."]
					]
				},
				{
					title: "Returns & Damaged Mail",
					items: [
						["What happens if my CD arrives damaged?", "If the CD itself is damaged, we first offer a replacement and a discount code for your next box. If replacement stock is unavailable, you receive a full refund for that box and can keep the damaged one. This applies to CD and product damage, not cosmetic shipping-box wear."]
					]
				},
				{
					title: "Artists",
					items: [
						["Is the booklet included with every box?", "Yes, every box includes the digipak CD, the artist booklet, and the art card described on the subscription page."],
						["How do I submit my music?", "Visit the For Artists page for details and a submission email."]
					]
				}
			]
		},

		// ===== LEGAL PAGES =====
		privacy: { title: "Privacy Policy", paragraphs: ["This placeholder policy page explains how Disc Delivery handles account details, order data, and contact information.", "We only store data needed to process memberships, orders, and support requests, and we never sell your personal information.", "For policy requests, contact customercare@discdelivery.com."] },
		terms: { title: "Terms of Service", paragraphs: ["This placeholder terms page outlines the rules for memberships, shop purchases, and the Disc Delivery website.", "By using the site, customers agree to payment, shipping, and cancellation terms presented at checkout.", "For legal questions, contact customercare@discdelivery.com."] },

		// ===== EDITIONS (SHARED SOURCE FOR HOME, ARCHIVE, AND SHOP) =====
		editions: {
			featuredId: "edition-004",
			items: [
				{ id: "edition-004", slug: "edition-004", editionCode: "Edition 004", monthYear: "August 2026", image: { src: "", alt: "Edition 004 artwork" }, description: "12 songs from 12 emerging artists, spanning melodic experimentation, cinematic textures, and direct songwriting.", inStock: true, tracklist: placeholderTracklist(4) },
				{ id: "edition-003", slug: "edition-003", editionCode: "Edition 003", monthYear: "July 2026", image: { src: "", alt: "Edition 003 artwork" }, description: "12 songs from 12 emerging artists, pairing rhythm-forward arrangements with intimate storytelling.", inStock: true, tracklist: placeholderTracklist(3) },
				{ id: "edition-002", slug: "edition-002", editionCode: "Edition 002", monthYear: "June 2026", image: { src: "", alt: "Edition 002 artwork" }, description: "12 songs from 12 emerging artists, crossing genres with a focus on mood and sonic detail.", inStock: true, tracklist: placeholderTracklist(2) },
				{ id: "edition-001", slug: "edition-001", editionCode: "Edition 001", monthYear: "May 2026", image: { src: "", alt: "Edition 001 artwork" }, description: "Our first edition: 12 songs from 12 emerging artists with direct lyrics and wide-open arrangements.", inStock: false, tracklist: placeholderTracklist(1) }
			]
		},

		// ===== SHOPIFY / CHECKOUT CONFIGURATION (NOT EDITORIAL CONTENT) =====
		checkout: {
			storeUrl: "",
			subscriptionVariants: { monthly: { variantId: "", quantity: 1 }, quarterly: { variantId: "", quantity: 1 } },
			pastEditionVariants: {}
		}
	};
})();
