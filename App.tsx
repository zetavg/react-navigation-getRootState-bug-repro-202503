import { createContext, useContext, useState } from "react";
import { Text, Button, View } from "react-native";
import {
  BaseNavigationContainer,
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigationContainerRefWithCurrent,
  type NavigationProp,
  useNavigation,
  useNavigationBuilder,
  useNavigationContainerRef,
} from "@react-navigation/core";
import {
  StackRouter,
  type StackNavigationState,
  type ParamListBase,
} from "@react-navigation/routers";

type SlotNavigatorOptions = {};
type StackNavigationEventMap = {};

type SlotNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  StackNavigationState<ParamListBase>,
  SlotNavigatorOptions,
  StackNavigationEventMap,
  NavigationProp<ParamListBase>
>;

function SlotNavigator(props: SlotNavigatorProps) {
  const { state, descriptors } = useNavigationBuilder(StackRouter, {
    ...props,
  });

  return descriptors[state.routes[state.index].key].render();
}

const Stack = createNavigatorFactory(SlotNavigator)();

const RootNavigationRefContext =
  createContext<NavigationContainerRefWithCurrent<ParamListBase> | null>(null);

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SubStack" component={SubStack} />
    </Stack.Navigator>
  );
}

function SubStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Page" component={Page} />
    </Stack.Navigator>
  );
}

function Home() {
  const rootNavigationRef = useContext(RootNavigationRefContext);

  return (
    <View style={{ padding: 8, gap: 8 }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to SubStack/Page via RESET"
        onPress={() => {
          rootNavigationRef.current?.dispatch({
            type: "RESET",
            payload: {
              stale: false,
              type: "stack",
              key: "stack-JncAAQHq",
              index: 1,
              routeNames: ["Home", "SubStack"],
              preloadedRoutes: [],
              routes: [
                {
                  key: "Home-5nJ1Y4jy",
                  name: "Home",
                },
                {
                  key: "SubStack-ub4xbcMr",
                  name: "SubStack",
                  state: {
                    stale: false,
                    type: "stack",
                    key: "stack-GuKgrRNP",
                    index: 0,
                    routeNames: ["Page"],
                    preloadedRoutes: [],
                    routes: [
                      {
                        key: "Page-OHaU9PdYq4RA_X_erLrEF",
                        name: "Page",
                      },
                    ],
                  },
                },
              ],
            },
          });
        }}
      />
      <Button
        title="Go to SubStack/Page"
        onPress={() => {
          rootNavigationRef.current?.dispatch({
            type: "NAVIGATE",
            payload: {
              name: "SubStack",
              params: {
                name: "Page",
              },
            },
          });
        }}
      />
    </View>
  );
}

function Page() {
  const rootNavigationRef = useContext(RootNavigationRefContext);
  const [counter, setCounter] = useState(0);

  return (
    <View style={{ padding: 8, gap: 8 }}>
      <Text>Page</Text>
      <Text>
        Root state: {JSON.stringify(rootNavigationRef?.getRootState(), null, 2)}
      </Text>
      <Button
        title="Re-render Page"
        onPress={() => {
          setCounter((c) => c + 1);
        }}
      />
      <Button
        title="Go Home"
        onPress={() => {
          rootNavigationRef.current?.dispatch({
            type: "NAVIGATE",
            payload: {
              name: "Home",
            },
          });
        }}
      />
    </View>
  );
}

export default function App() {
  const navigationRef = useNavigationContainerRef<ParamListBase>();

  return (
    <View>
      <BaseNavigationContainer ref={navigationRef}>
        <RootNavigationRefContext.Provider value={navigationRef}>
          <RootStack />
        </RootNavigationRefContext.Provider>
      </BaseNavigationContainer>
    </View>
  );
}
