// Public imports
import fs from 'fs-extra'
import DiscordJS from 'discord.js'

// Private imports


/*		=================		*/
/*		|	  CLASS		|		*/
/*		=================		*/

// Class d'aide
export class helpC {
	constructor (message, client, servID, servName) {
		this.message = message;
		this.client = client;
		this.servID = servID;
		this.path = "servers/" + servName + "/";
	}

	async exec () {
		let msg = this.message.content;
		if (msg == "*help")
			return this.all();
		else if (msg == "*help server")
			return this.server();
		else if (msg == "*help club")
			return this.club();
		else if (msg == "*help player")
			return this.player();
		else if (msg == "*help esper")
			return this.esper();
		else if (msg == "*help holo")
			return this.holo();
		return ;
	}


	all () {
		let msg = "```cs\n";
		msg += "  Liste des commandes :\n\n\n";
		msg += "# SERVER                        CLUB                       PLAYER\n\n";
		msg += "  *server set admin [tag]       *club add [nom][role]      *player add [nom][tag]\n";
		msg += "  *server set welcome [tag]     *club remove [nom]         *player remove [nom]\n";
		msg += "                                *club list                 *player info [nom]\n";
		msg += "                                *club members [nom?]       *player stat set [args]\n";
		msg += "                                                           *player stat adminset [args]\n";
		msg += "                                                           *player stats\n";
		msg += "                                                           *player adminstats\n\n\n\n";
		msg += "# ESPER                                        HOLO                                 HELP\n\n";
		msg += "  *esper [esper][niveau][speed]                *holo channel [club][tag]            *help\n";
		msg += "  *esper remove [esper]                        *holo start [joueurs][points]        *help server\n";
		msg += "  *esper list {en maintenance}                 *holo stop                           *help club\n";
		msg += "  *esper admin [pseudo][esper][niv][speed]                                          *help player\n";
		msg += "  *esper admin remove [pseudo][esper]                                               *help esper\n\n\n";
		msg += "# DyslyteHelper by konwiz\n";
		msg += "```";
		return this.message.channel.send(msg)
	}

	server () {
		let msg = "```cs\n";
		msg += "    Liste des commandes serveurs :\n\n\n";
		msg += "#   *server set admin [tag du rôle]:\n";
		msg += "        Définit le rôle admin.\n        Il faut tag le rôle en faisant @[insérer le role].\n        Prporiétaire uniquement.\n\n";
		msg += "#   *server set welcome [tag du salon] :\n";
		msg += "        Définit le salon d`accueil.\n        Ne pas faire la commande pour ne pas avoir de messages de bienvenue.\n        Il faut tag le salon en faisant #[insérer le salon].\n        Admin uniquement.\n\n\n";
		msg += "# DyslyteHelper by konwiz\n";
		msg += "```";
		return this.message.channel.send(msg)
	}

	club () {
		let msg = "```cs\n";
		msg += "    Liste des commandes de club :\n\n\n";
		msg += "#   *club add [nom du club][tag du rôle]:\n";
		msg += "        Crée un nouveau club.\n        Il faut tag le rôle associé au club en faisant @[insérer le role].\n        Admin uniquement.\n\n";
		msg += "#   *club remove [nom du club] :\n";
		msg += "        Supprime le club.\n        Admin uniquement.\n\n";
		msg += "#   *club list :\n";
		msg += "        Affiche la liste des clubs ainsi que certaines informations.\n\n";
		msg += "#   *club members ou *club members [nom du club]:\n";
		msg += "        Affiche les membres de tous les clubs ou seulement d`un seul si [nom du club] est spécifié.\n\n\n";
		msg += "# DyslyteHelper by konwiz\n";
		msg += "```";
		return this.message.channel.send(msg)
	}

	player () {
		let msg = "```cs\n";
		msg += "    Liste des commandes player :\n\n\n";
		msg += "#   *player add [pseudo][club][tag]:\n";
		msg += "        Crée une nouvelle fiche joueur.\n             Admin uniquement.\n\n";
		msg += "#  *player remove [pseudo] :\n";
		msg += "        Supprime la fiche joueur.\n         Admin uniquement.\n\n";
		msg += "#   *player info [pseudo] :\n";
		msg += "        Affiche la partie information de la fiche joueur.\n\n";
		msg += "#   *player stat set [args]:\n";
		msg += "        Renseigne les statistiques du joueur.\n";
		msg += "        [args] : il est possible de soit renseigner toutes les infos d`un coup, soit une info spécifique :\n";
		msg += "                 exemple : *player stat set 60 100 39 10 10 10\n";
		msg += "                        ou *player stat set tour1 100\n";
		msg += "                 Les arguments sont dans l`ordre : level, tour1, tour2, kronos, apep, fafnir\n\n";
		msg += "#   *player stat adminset [pseudo][args]:\n";
		msg += "        Renseigne les statistiques du joueur autre que soit même.\n         Admin uniquement.\n";
		msg += "        [args] : il est possible de soit renseigner toutes les infos d`un coup, soit une info spécifique :\n";
		msg += "                 exemple : *player stat adminset konwiz 60 100 39 10 10 10\n";
		msg += "                        ou *player stat adminset konwiz tour1 100\n";
		msg += "                 Les arguments sont dans l`ordre : level, tour1, tour2, kronos, apep, fafnir\n";
		msg += "#   *player stats :\n";
		msg += "        Affiche ses statistiques.\n\n";
		msg += "#   *player adminstats [pseudo] :\n";
		msg += "        Affiche les statistiques d`un joueur en particulier.\n         Admin uniquement.\n\n\n";
		msg += "# DyslyteHelper by konwiz\n";
		msg += "```";
		return this.message.channel.send(msg)
	}

	esper () {
		let msg = "```cs\n";
		msg += "    Liste des commandes esper :\n\n\n";
		msg += "#   *esper [esper][niveau][speed] :\n";
		msg += "        Ajoute un esper à votre box ou modifie ses stats.\n        Le nom de l`esper doit être sans les espaces.\n\n";
		msg += "#   *esper remove [esper] :\n";
		msg += "        Supprime l`esper de votre box.\n        Le nom de l`esper doit être sans les espaces.\n\n";
		msg += "#   *esper list {en maintenance} :\n";
		msg += "        Affiche la liste des esper.\n\n";
		msg += "#   *esper admin [pseudo][esper][niveau][speed] :\n";
		msg += "        Ajoute un esper à la box du joueur ou modifie ses stats.\n        Le nom de l`esper doit être sans les espaces.\n         Admin uniquement.\n\n";
		msg += "#   *esper admin remove [esper] :\n";
		msg += "        Supprime l`esper de la box du joueur.\n        Le nom de l`esper doit être sans les espaces.\n         Admin uniquement.\n\n\n";
		msg += "# DyslyteHelper by konwiz\n";
		msg += "```";
		return this.message.channel.send(msg)
	}

	holo () {
		let msg = "```cs\n";
		msg += "    Liste des commandes d`holocombat :\n\n\n";
		msg += "#   *holo channel [club][tag] :\n";
		msg += "        Assigne un salon holocombat à un club.\n         Admin uniquement.\n\n";
		msg += "#   *holo start [nombres de joueurs][points à atteindre] :\n";
		msg += "        Lance un holocombat si effectué dans le channel du club.\n         Admin uniquement.\n\n";
		msg += "#   *holo stop :\n";
		msg += "        Arrête l`holocombat en cours si effectué dans le channel du club.\n        Admin uniquement.\n\n";
		msg += "# DyslyteHelper by konwiz\n";
		msg += "```";
		return this.message.channel.send(msg)
	}

	error (x) {
		if (x === 1) {
			this.message.channel.send("**Ce n'est pas une commande valide : *help**");
		}
	}
}