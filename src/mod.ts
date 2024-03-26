import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

// New trader settings
import * as baseJson from "../db/base.json";
import { TraderHelper } from "./traderHelpers";
import { FluentAssortConstructor } from "./fluentTraderAssortCreator";
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";

class SampleTrader implements IPreAkiLoadMod, IPostDBLoadMod
{
    private readonly mod: string
    private logger: ILogger
    private traderHelper: TraderHelper
    private fluentTraderAssortHelper: FluentAssortConstructor

    constructor() 
    {
        this.mod = "spt_iona"; // Set name of mod, so we can log it to console later
    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void
    {
        // Get a logger
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);
        this.logger.log("Iona is saving her game and will be with you shortly.", "italic magenta");

        // Get SPT code/data we need later
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new TraderHelper();
        this.fluentTraderAssortHelper = new FluentAssortConstructor(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "iona.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 10);

        // Add trader to trader enum
        Traders[baseJson._id] = baseJson._id;

        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;

        this.logger.log("Iona is ready to sell you all your degen needs.", "italic magenta");
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        container.resolve<ConfigServer>("ConfigServer");
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil);

        // Can find item ids in `database\templates\items.json` or with https://db.sp-tarkov.com/search
        this.fluentTraderAssortHelper.createSingleAssortItem("CinnamorollVudu")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHelper.createSingleAssortItem("CinnamorollVltor")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHelper.createSingleAssortItem("CinnamorollSpacer")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHelper.createSingleAssortItem("CinnamorollInsight")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHelper.createSingleAssortItem("CinnamorollAimpoint")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHelper.createSingleAssortItem("CinnamorollNoveske")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHelper.createSingleAssortItem("CinnamorollST2")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollGenM3")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollURX38")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollURX1075")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollAvalanche")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollForegripBcm")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollMk12Low")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollKacPanelShort")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollURX38Lower")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        this.fluentTraderAssortHelper.createSingleAssortItem("cinnamorollURX1075Lower")
            .addStackCount(200)
            .addBuyRestriction(10)
            .addMoneyCost(Money.ROUBLES, 2000)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);

        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Iona", baseJson.nickname, baseJson.location, "Iona is a weeb stuck in a warzone willing to sell degen material to anyone with the cash.");

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new SampleTrader() }