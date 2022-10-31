import {CurrentOrder, Item, Option, OrderItem, UsualOrder} from '../../models';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {AuthState} from './enums';
import {Region} from 'react-native-maps';

export type HubPayload = {
  event: string;
  data?: any;
  message?: string;
};

// Dictionary from the minute of the day to the list of orders currently running at that minute.
export type DigitalQueue = {[minute: number]: string[]};

export type GlobalState = {
  auth_state: AuthState;
  current_user: LocalUser | null;
  auth_user: AuthUser | null;
  network_status: boolean;
};

export type CommonBasketItem = {
  name: string;
  quantity: number;
  options: Option[];
};

export type AuthUser = {
  sub: string;
  user: CognitoUser;
};

export type TrackOrderState = {
  current_order: CurrentOrder | null;
  is_locatable: boolean;
  location: Location | null;
  ratings: PreRating[];
  map_region: Region | undefined;
  manually_centered: boolean;
  is_user_centered: boolean;
};

export type OrderingState = {
  current_shop_id: string | null;
  common_basket: CommonBasketItem[];
  scheduled_time: number;
  specific_basket: OrderItem[];
  common_items: Item[];
  specific_items: Item[];
  payment_id: string | null;
};

export type SignInState = {
  trials: number;
  blocked_time: number;
  phone_number: string;
  session: CognitoUser | null;
};

export type Location = {latitude: number; longitude: number};

export type PreferenceWeights = {
  queue: number;
  personal_taste: number;
  general_taste: number;
  distance: number;
  price: number;
};

export type ShopMarker = {
  name: string;
  description: string;
  coords: Location;
  image: string;
  is_open: boolean;
};

export type GlobalAction =
  | {type: 'SET_CURRENT_USER'; payload: LocalUser | null}
  | {type: 'SET_AUTH_STATE'; payload: AuthState}
  | {type: 'SET_AUTH_USER'; payload: AuthUser | null}
  | {type: 'SET_NETWORK_STATUS'; payload: boolean};

export type TrackOrderAction =
  | {type: 'SET_CURRENT_ORDER'; payload: CurrentOrder}
  | {type: 'SET_IS_LOCATABLE'; payload: boolean}
  | {type: 'SET_IS_USER_CENTERED'; payload: boolean}
  | {type: 'SET_MAP_REGION'; payload: Region | undefined}
  | {type: 'SET_IS_MANUALLY_CENTERED'; payload: boolean}
  | {type: 'SET_RATINGS'; payload: PreRating[]}
  | {type: 'SET_LOCATION'; payload: Location | null};

export type OrderingAction =
  | {type: 'SET_CURRENT_SHOP_ID'; payload: string}
  | {type: 'SET_COMMON_BASKET'; payload: CommonBasketItem[]}
  | {type: 'SET_SPECIFIC_BASKET'; payload: OrderItem[]}
  | {type: 'SET_SCHEDULED_TIME'; payload: number}
  | {type: 'SET_SPECIFIC_ITEMS'; payload: Item[]}
  | {type: 'SET_PAYMENT_ID'; payload: string}
  | {type: 'SET_COMMON_ITEMS'; payload: Item[]};

export type SignInAction =
  | {type: 'SET_TRIALS'; payload: number}
  | {type: 'SET_BLOCKED_TIME'; payload: number}
  | {type: 'SET_SESSION'; payload: CognitoUser}
  | {type: 'SET_PHONE'; payload: string};

export type PreRating = {
  rating: number;
  itemID: string;
};

export type PaymentParams = {
  amount: number;
  currency: string;
  name?: string;
  phone?: string;
  customer_id?: string;
};

export type AndroidNotifSpec = {
  channelId: string; // (required) channelId, if the channel doesn't exist, notification will not trigger.
  ticker?: string; // (optional)
  showWhen?: boolean; // (optional) default: true
  autoCancel?: boolean; // (optional) default: true
  largeIcon?: string; // (optional) default: "ic_launcher". Use "" for no large icon.
  largeIconUrl?: string; // (optional) default: undefined
  smallIcon?: string; // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
  bigText?: string; // (optional) default: "message" prop
  subText?: string; // (optional) default: none
  bigPictureUrl?: string; // (optional) default: undefined
  bigLargeIcon?: string; // (optional) default: undefined
  bigLargeIconUrl?: string; // (optional) default: undefined
  color?: string; // (optional) default: system default
  vibrate?: boolean; // (optional) default: true
  vibration?: number; // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  tag?: string; // (optional) add tag to message
  group?: string; // (optional) add group to message
  groupSummary?: boolean; // (optional) set this notification to be the group summary for a group of notifications, default: false
  ongoing?: boolean; // (optional) set whether this is an "ongoing" notification
  priority?: string; // (optional) set notification priority, default: high
  visibility?: string; // (optional) set notification visibility, default: private
  ignoreInForeground?: boolean; // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
  shortcutId?: string; // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
  onlyAlertOnce?: boolean; // (optional) alert will open only once with sound and notify, default: false
  when?: number | null; // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
  usesChronometer?: boolean; // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
  timeoutAfter?: number | null; // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
  messageId?: string; // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.
  actions?: string[]; // (Android only) See the doc for notification actions to know more
  invokeApp?: boolean; // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
};

export type iosNotifSpec = {
  category?: string; // (optional) default: empty string
  subtitle?: string; // (optional) smaller title below notification title
};

export type GenericNotifSpec = {
  /* iOS and Android properties */
  id?: number; // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
  title: string; // (optional)
  message: string; // (required)
  picture?: string; // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
  userInfo?: {} | Object; // (optional) default: {} (using null throws a JSON value '<null>' error)
  playSound?: boolean; // (optional) default: true
  soundName?: string; // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
  number?: number; // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  repeatType?: string; // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
};

export type LocalUser = {
  id: string;
  is_signed_in: boolean;
  phone: string;
  name: string;
  payment_method: string | null | undefined;
  the_usual: UsualOrder | null | undefined;
  customer_id: string | null | undefined;
  device_token: string;
};
