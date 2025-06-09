#include <bits/stdc++.h>
using namespace std;

int a[300];
void solve() {
    int n, s; cin >> n >> s;

    for (int i = 0; i<n; i++) cin >> a[i];

    vector<int> dp(s + 1, 0);
    //define dp[i] ? 0 : 1 (if the state is reachable)  : (not reachable);
    dp[0] = 1;
    for (int i = 1; i<=s; i++) {
    }

    cout << (dp[s] ? "YES\n": "NO\n") << '\n';

}

int main(){
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr); cout.tie(nullptr);

    int nt; cin >> nt;
    while (nt--) {
        solve();
    }
    return 0;
}
