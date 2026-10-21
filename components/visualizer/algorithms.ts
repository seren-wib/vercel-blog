/**
 * Programs for the sort visualizer. Each one reads n and n numbers from stdin, sorts them,
 * and prints a step trace that the page animates:
 *
 *   INIT v0 v1 ...    the input
 *   PHASE name        a new stage, shown as a caption
 *   CMP i j           compared a[i] and a[j]
 *   SWAP i j          swapped a[i] and a[j]
 *   SORTED i          a[i] is in its final place
 *   DONE v0 v1 ...    the result
 */
export type VisualizerLanguage = 'c' | 'python'

export type Algorithm = {
  name: string
  /** Captions for the stage names printed with PHASE */
  phases: Record<string, string>
  /** Legend label for bars not yet in place */
  unsortedLabel: string
  code: Record<VisualizerLanguage, string>
}

export const algorithms = {
  'heap-sort': {
    name: 'Heap Sort',
    phases: { build: 'Build max-heap', sort: 'Move the max to the end' },
    unsortedLabel: 'Heap',
    code: {
      c: `#include <stdio.h>

#define MAX_N 64

static int a[MAX_N];
static int n;

static void print_array(const char *tag) {
    printf("%s", tag);
    for (int i = 0; i < n; i++) printf(" %d", a[i]);
    printf("\\n");
}

static void swap(int i, int j) {
    int t = a[i];
    a[i] = a[j];
    a[j] = t;
    printf("SWAP %d %d\\n", i, j);
}

/* Push a[i] down until it is larger than both children (heap is a[0..size-1]). */
static void sift_down(int i, int size) {
    for (;;) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        if (left < size) {
            printf("CMP %d %d\\n", left, largest);
            if (a[left] > a[largest]) largest = left;
        }
        if (right < size) {
            printf("CMP %d %d\\n", right, largest);
            if (a[right] > a[largest]) largest = right;
        }
        if (largest == i) return;
        swap(i, largest);
        i = largest;
    }
}

static void heap_sort(void) {
    printf("PHASE build\\n");
    for (int i = n / 2 - 1; i >= 0; i--) sift_down(i, n);

    printf("PHASE sort\\n");
    for (int end = n - 1; end > 0; end--) {
        swap(0, end);           /* the max goes to the end */
        printf("SORTED %d\\n", end);
        sift_down(0, end);      /* repair the smaller heap */
    }
    printf("SORTED 0\\n");
}

int main(void) {
    if (scanf("%d", &n) != 1 || n < 1 || n > MAX_N) return 1;
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);

    print_array("INIT");
    heap_sort();
    print_array("DONE");
    return 0;
}
`,
      python: `def sift_down(a, i, size):
    """Push a[i] down until it is larger than both children (heap is a[0:size])."""
    while True:
        largest = i
        left, right = 2 * i + 1, 2 * i + 2
        if left < size:
            print("CMP", left, largest)
            if a[left] > a[largest]:
                largest = left
        if right < size:
            print("CMP", right, largest)
            if a[right] > a[largest]:
                largest = right
        if largest == i:
            return
        a[i], a[largest] = a[largest], a[i]
        print("SWAP", i, largest)
        i = largest


def heap_sort(a):
    n = len(a)
    print("PHASE build")
    for i in range(n // 2 - 1, -1, -1):
        sift_down(a, i, n)

    print("PHASE sort")
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]  # the max goes to the end
        print("SWAP", 0, end)
        print("SORTED", end)
        sift_down(a, 0, end)  # repair the smaller heap
    print("SORTED", 0)


n = int(input())
a = list(map(int, input().split()))[:n]

print("INIT", *a)
heap_sort(a)
print("DONE", *a)
`,
    },
  },
} satisfies Record<string, Algorithm>

export type AlgorithmId = keyof typeof algorithms
