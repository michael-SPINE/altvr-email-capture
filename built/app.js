"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));

const Nylas = __importStar(require("nylas"));

Nylas.config({
	clientId:process.env.2rv9sj5fx3xn2ndilrsfxm2kk,
	clientSecret: 9o0r6m1e9hm5tz4uoli6tlrvq
});

const nylas = Nylas.with(tXChXSsBEIQ9dQp0fG5RdxgasSnz3n);

class EmailCapture {
    /**
     * Context Constructor
     */
    constructor(context, baseUrl) {
        this.context = context;
        this.baseUrl = baseUrl;
        // Console debug statements?
        this.DEBUG = true;
        // Internal List of Emails
        this.EmailList = new Map();
        this.position = null;
        this.rotation = null;
        this.buttonActor = null;
        this.labelActor = null;
        this.labelText = "Click To Sign Up!";
        this.context.onStarted(() => this.init());654
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  SIGN UP :: Add your address to the emailing list
    //
    async signUp(user) {
        // GET CONTEXT
        const userId = user.id.toString();
        const userName = user.name;
        const spaceId = user.properties["altspacevr-space-id"];
        const eventId = user.properties["altspacevr-event-id"];
        const isEvent = (eventId === null) ? false : true;
        const locationId = (isEvent) ? eventId : spaceId;
        if (this.DEBUG) {
            //console.info("\n\n");
            //console.info(" >>> DEBUG >>> userId: " + userId);
            //console.info(" >>> DEBUG >>> spaceId: " + spaceId);
            //console.info(" >>> DEBUG >>> eventId: " + eventId);
            //console.info(" >>> DEBUG >>> isEvent: " + isEvent);
            //console.info(user.context);
            //console.info(user.properties);
        }
        // PROMPT FOR EMAIL
        this.userInput = await user.prompt("Enter your email address:", true);
        if (!this.userInput.submitted || this.userInput.text === '') { return; }
        const emailAddress = this.userInput.text.toLowerCase();

        // ADD TO LIST
        //this.EmailList.set(userId, emailAddress);
        //console.log(emailAddress); //BUGTESTING
        const newEmail = userId + " : " + emailAddress + "\r\n";

        // RETURN
        return await user.prompt("You entered: " + emailAddress + "\n\nWe'll email you with more information soon!");

		const draft = nylas.drafts.build({
			subject: "Client Lead from ALTSPACEVR",
			to: [{ name: "Client Lead", email: "michaelslicht@gmail.com" }],
			body: "This person: " + userId + " at email " + emailAddress + " wants more information"
			});

			//Semd the draft
			draft.send().then(message => {
			console.log(message);
			});

    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //  
    //  INIT APP
    //
    init() {
        this.assets = new MRE.AssetContainer(this.context);
        // Materials
        this.buttonMaterial = this.assets.createMaterial('buttonMaterial', {
            color: { r: 180 / 255, g: 255 / 255, b: 0 / 255, a: 255 / 255 },
            alphaMode: MRE.AlphaMode.Blend
        });
        // Meshes
        this.buttonMesh = this.assets.createBoxMesh('buttonMesh', .35, .35, .35);
        // Create Button
        this.position = { x: 0.0, y: 0.0, z: 0.0 };
        this.rotation = MRE.Quaternion.FromEulerAngles(0 * MRE.DegreesToRadians, 0 * MRE.DegreesToRadians, 0 * MRE.DegreesToRadians);
        this.buttonActor = MRE.Actor.Create(this.context, {
            actor: {
                name: 'Signup Button',
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                transform: { local: { position: this.position, rotation: this.rotation } },
                appearance: { materialId: this.buttonMaterial.id, meshId: this.buttonMesh.id }
            }
        });
        // Add Text Label
        this.position = { x: 0, y: .35, z: 0 };
        this.rotation = MRE.Quaternion.FromEulerAngles(0 * MRE.DegreesToRadians, 0 * MRE.DegreesToRadians, 0 * MRE.DegreesToRadians);
        this.labelActor = MRE.Actor.Create(this.context, {
            actor: {
                name: 'Button Label',
                transform: { local: { position: this.position, rotation: this.rotation, scale: { x: 2, y: 2, z: 2 } } },
                text: { contents: this.labelText, justify: MRE.TextJustify.Center,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, height: 0.035 }
            }
        });
        // On click...
        const buttonBehavior = this.buttonActor.setBehavior(MRE.ButtonBehavior);
        buttonBehavior.onButton('released', (user) => {
            // Trigger signUp() function
            this.signUp(user);
        });
    }
}
exports.default = EmailCapture;
//# sourceMappingURL=app.js.map