# App Initializer Implementation

## Overview

The app initializer ensures that essential data (countries, supported countries, and currencies) is loaded before the application becomes available to users. This prevents users from experiencing missing data or errors when the app first loads.

## Components

### 1. AppInitializerService (`app-initializer.service.ts`)
- Coordinates the loading of all required data
- Uses `forkJoin` to load data in parallel for better performance
- Handles errors gracefully and allows the app to continue even if some data fails to load
- Marks the app as initialized when the process completes

### 2. AppStateService (`app-state.service.ts`)
- Tracks the initialization state using Angular signals
- Provides methods to control the initialization state
- Used by the app component to show/hide the loading screen

### 3. App Initializer Factory (`app-initializer.factory.ts`)
- Factory function that creates the app initializer
- Used in the app configuration to register the initializer

## How It Works

1. **App Startup**: When the app starts, the `APP_INITIALIZER` token triggers the initialization process
2. **Data Loading**: The initializer loads countries, supported countries, and currencies in parallel
3. **Loading Screen**: During initialization, users see a loading screen with a message
4. **App Ready**: Once all data is loaded (or if errors occur), the app becomes available to users

## Configuration

The app initializer is configured in `app.config.ts`:

```typescript
{
  provide: APP_INITIALIZER,
  useFactory: appInitializerFactory,
  multi: true,
}
```

## Error Handling

- If any individual data load fails, the app continues to function
- Failed loads are logged to the console for debugging
- The app initialization process completes regardless of individual failures
- Individual services handle their own error states and fallbacks

## Benefits

- **Better UX**: Users don't see missing data or errors on app startup
- **Performance**: Data is loaded in parallel for faster initialization
- **Reliability**: App continues to work even if some data fails to load
- **Debugging**: Clear logging helps identify initialization issues

## Usage

The app initializer runs automatically on app startup. No additional configuration is needed. The loading screen will automatically show during initialization and hide when complete.
